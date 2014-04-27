/*
 * ACCESSdb JavaScript Library v0.9.2
 *
 * Joshua Faulkenberry
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: 2009-03-14
 * Revision: 4
 */
(function() {

   //Helper function to handle Date formatting
   window.Date.prototype.format = function(format) {
      if (format == "@") { return this.getTime(); }
      var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
      var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
      var LZ = function(x) { return (x < 0 || x > 9 ? "" : "0") + x} 
      var date = this;
      format = format + "";
      var result = "";
      var i_format = 0;
      var c = "";
      var token = "";
      var y = date.getYear() + "";
      var M = date.getMonth() + 1;
      var d = date.getDate();
      var E = date.getDay();
      var H = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
      // Convert real date parts into formatted versions
      var value = new Object();
      if (y.length < 4) {
         y = "" + (y - 0 + 1900);
      }
      value["y"] = "" + y;
      value["yyyy"] = y;
      value["yy"] = y.substring(2, 4);
      value["M"] = M;
      value["MM"] = LZ(M);
      value["MMM"] = MONTH_NAMES[M - 1];
      value["NNN"] = MONTH_NAMES[M + 11];
      value["d"] = d;
      value["dd"] = LZ(d);
      value["E"] = DAY_NAMES[E + 7];
      value["EE"] = DAY_NAMES[E];
      value["H"] = H;
      value["HH"] = LZ(H);
      if (H == 0) {
         value["h"] = 12;
      }
      else if (H > 12) {
         value["h"] = H - 12;
      }
      else {
         value["h"] = H;
      }
      value["hh"] = LZ(value["h"]);
      if (H > 11) {
         value["K"] = H - 12;
      }
      else {
         value["K"] = H;
      }
      value["k"] = H + 1;
      value["KK"] = LZ(value["K"]);
      value["kk"] = LZ(value["k"]);
      if (H > 11) {
         value["a"] = "PM";
      }
      else {
         value["a"] = "AM";
      }
      value["m"] = m;
      value["mm"] = LZ(m);
      value["s"] = s;
      value["ss"] = LZ(s);
      while (i_format < format.length) {
         c = format.charAt(i_format);
         token = "";
         while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
         }
         if (value[token] != null) {
            result = result + value[token];
         }
         else {
            result = result + token;
         }
      }
      return result;
   }
   
   
   ACCESSdb = function(dataSrc, options) {
      this.options = options || {};
      this.options.showErrors = this.options.showErrors || false;
      this.options.adOpenDynamic = this.options.adOpenDynamic || 2;
      this.options.adLockOptimistic = this.options.adLockOptimistic || 3;
      this.options.persist = this.options.persist || false;
     this.options.user = this.options.user || "";
     this.options.password = this.options.password || "";
     this.options.wrkgrpFile = "Jet OLEDB:System Database="+this.options.wrkgrpFile+";" || "";
      this.dataSource = dataSrc;
      this.provider = "Microsoft.Jet.OLEDB.4.0";
      this.conn = new ActiveXObject("ADODB.Connection");
      
      this.query = function(query, options) {
         if (!options) {
            options = {};
         }
         var result = true;
         var rs = new ActiveXObject("ADODB.Recordset");
         try {
            rs.open(query, this.conn, this.options.adOpenDynamic, this.options.adLockOptimistic);
         } 
         catch (e) {
            if (this.options.showErrors) {
               alert("Query " + e.name + "\n\n" + e.description);
            }
            if (options.errorHandler) {
               options.errorHandler(e);
            }
            result = false;
         }
         if (rs.Fields.Count) {
            if (!rs.bof && !rs.eof) {
               if (options.json) {
                  result = this.outJSON(rs);
               }
               else if (options.xml) {
                  result = this.outXML(rs, options.xml);
               }
               else if (options.table) {
                  result = this.outTable(rs, options.table);
               }
               else {
                  result = eval("(" + this.outJSON(rs) + ")");
               }
            }
            else {
               result = false;
            }
            rs.close();
         }
       else {
         result = false;
       }
         return result;
      };
      
      this.insert = function(table, data, options) {
         if (!options) {
            options = {};
         }
         var insList = [];
         var insStr = "INSERT INTO " + table + " (";
         data = this.translate(data);
         if (!data) { return false; }
         for (var key in data[0]) {
            if (key != "ID") {
               insStr += "" + key + ",";
            }
         }
         insStr = insStr.slice(0, insStr.length - 1) + ") VALUES(%%%)\n";
         for (var x = 0, row; row = data[x]; x++) {
            var rowIns = "";
            for (var key in row) {
               if (key != "ID") {
                  var val = row[key];
                  if (typeof(val) == "number" || typeof(val) == "boolean") {
                     rowIns += val + ",";
                  }
                  else {
                     val = val.replace(/\"/g, '&#34;');
                     val = val.replace(/\'/g, '&#39;');
                     rowIns += "\"" + val + "\",";
                  }
               }
            }
            insList[insList.length] = insStr.replace("%%%", rowIns.slice(0, rowIns.length - 1));
         }
         var noerr = true;
         for (var x = 0, sql; sql = insList[x]; x++) {
            if (!this.query(sql, options)) {
               noerr = false;
               break;
            }
         }
         return noerr;
      };
      
      this.translate = function(data) {
         var tranObj;
         if (typeof(data) == "string") {
            if (data.replace(/^\s*(.*?)\s*$/, "$1").charAt(0) == "<" && data.replace(/^\s*(.*?)\s*$/, "$1").charAt(data.replace(/^\s*(.*?)\s*$/, "$1").length - 1) == ">") {
               //Should be XML String
               var err = false;
               try {
                  varxmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                  xmlDoc.async = "false";
                  xmlDoc.loadXML(data);
               } 
               catch (e) {
                  tranObj = false;
                  err = true;
                  if (this.options.showErrors) {
                     alert("XML " + e.name + "\n\n" + e.description);
                  }
               }
               if (!err) tranObj = this.convertXML(xmlDoc);
            }
            else if (data.replace(/^\s*(.*?)\s*$/, "$1").charAt(0) == "[" && data.replace(/^\s*(.*?)\s*$/, "$1").charAt(data.replace(/^\s*(.*?)\s*$/, "$1").length - 1) == "]") {
               //Should be JSON String
               try {
                  tranObj = eval("(" + data + ")");
               } 
               catch (e) {
                  tranObj = false;
                  if (this.options.showErrors) {
                     alert("JSON " + e.name + "\n\n" + e.description);
                  }
               }
            }
         }
         else if (typeof(data) == "object") {
            if (data.nodeName) {
               //Should be XML Object
               tranObj = this.convertXML(data);
            }
            else if (data[0]) {
               //Should be JSON Object
               tranObj = data;
            }
         }
         return tranObj;
      };
      
      this.convertXML = function(xmlDoc) {
         var jsObj = [];
         for (var x = 0, row; row = xmlDoc.getElementsByTagName("record")[x]; x++) {
            jsObj[x] = {};
            for (var y = 0, col; col = row.childNodes[y]; y++) {
               jsObj[x][col.nodeName] = col.text;
            }
         }
         return jsObj;
      };
      
      this.outJSON = function(rs) {
         var json = "[";
         rs.MoveFirst();
         while (!rs.eof) {
            json += '{';
            for (var x = 0; x < rs.Fields.Count; x++) {
               json += '"' + rs.Fields(x).Name + '":';
               var val = rs.Fields(x).Value;
               if (typeof(val) == "string") {
                  val = val.replace(/\"/g, '&#34;');
                  val = val.replace(/\'/g, '&#39;');
                  val = '"' + val + '"';
               }
               if (typeof(val) == "date") {
                  val = "new Date(\"" + val + "\")";
               }
               json += val + ',';
            }
            json = json.slice(0, json.length - 1);
            rs.MoveNext();
            json += '},';
         }
         json = json.slice(0, json.length - 1);
         json += ']';
         return json;
      };
      
      this.outXML = function(rs, options) {
         var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><recordset>";
         rs.MoveFirst();
         while (!rs.eof) {
            xml += '<record>';
            for (var x = 0; x < rs.Fields.Count; x++) {
               var val = rs.Fields(x).Value;
               if (typeof(val) == "string") {
                  val = val.replace(/\&/g, '&#38;');
                  val = val.replace(/\</g, '&#60;');
                  val = val.replace(/\>/g, '&#62;');
               }
               else if (typeof(val) == "date" && options.formatDates) {
                  if (typeof(options.formatDates) == "string") {
                     val = (new Date((val))).format(options.formatDates);
                  }
                  else {
                     for (var col in options.formatDates) {
                        if (col == rs.Fields(x).Name) {
                           val = (new Date((val))).format(options.formatDates[col]);
                        }
                     }
                  }
               }
               xml += "<" + rs.Fields(x).Name + ">" + val + "</" + rs.Fields(x).Name + ">";
            }
            xml += '</record>';
            rs.MoveNext();
         }
         xml += '</recordset>';
         
         if (!options.stringOut) {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xml);
            xml = xmlDoc;
         }
         return xml;
      };
      
      this.outTable = function(rs, options) {
         var tbl = document.createElement("table");
         tbl.cellPadding = 0;
         tbl.cellSpacing = 0;
         var tbody = document.createElement("tbody");
         tbl.appendChild(tbody);
         if (options.id) {
            tbl.id = options.id;
         }
         if (options.className) {
            tbl.className = options.className;
         }
         rs.MoveFirst();
         if (!options.noHeaders) {
            var row = document.createElement("tr");
            tbody.appendChild(row);
            for (var x = 0; x < rs.Fields.Count; x++) {
               var hdr = document.createElement("th");
               hdr.innerHTML = rs.Fields(x).Name;
               row.appendChild(hdr);
            }
         }
         while (!rs.eof) {
            var row = document.createElement("tr");
            tbody.appendChild(row);
            for (var x = 0; x < rs.Fields.Count; x++) {
               var val = rs.Fields(x).Value;
               if (typeof(val) == "string") {
                  val = val.replace(/\&/g, '&#38;');
                  val = val.replace(/\</g, '&#60;');
                  val = val.replace(/\>/g, '&#62;');
               }
               else if (typeof(val) == "date" && options.formatDates) {
                  if (typeof(options.formatDates) == "string") {
                     val = (new Date((val))).format(options.formatDates);
                  }
                  else {
                     for (var col in options.formatDates) {
                        if (col == rs.Fields(x).Name) {
                           val = (new Date((val))).format(options.formatDates[col]);
                        }
                     }
                  }
               }
               var cell = document.createElement("td");
               cell.innerHTML = val;
               row.appendChild(cell);
            }
            rs.MoveNext();
         }
         if (options.stringOut) { return tbl.outerHTML; }
         return tbl;
      };
      
      this.kill = function() {
         this.conn.close();
         //delete this;
      };
      
      try {
         this.conn.open("Provider = " + this.provider + ";Data Source = " + this.dataSource + ";"+this.options.wrkgrpFile+"Persist Security Info = " + this.options.persist, this.options.user, this.options.password);
      } 
      catch (e) {
         if (this.options.showErrors) {
            alert("Load DB " + e.name + "\n\n" + e.description);
         }
      }
   };
   
})();