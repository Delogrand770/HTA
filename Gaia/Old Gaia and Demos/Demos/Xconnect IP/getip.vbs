Option Explicit
' On Error Resume Next
Dim IP_Address : IP_Address = GetIP() ' Let's get the first IP address with non-zero subnet mask on the system
Dim wshShell,objShell,colVolEnvVars,strCurrentValue' Dim all of our variables
Set wshShell = CreateObject("WScript.Shell") 

Set objShell = WScript.CreateObject("WScript.Shell")
Set colVolEnvVars = objShell.Environment("VOLATILE")' Set the current environment
strCurrentValue = colVolEnvVars("IPADDR")' Get the current environment value 
'Wscript.Echo colVolEnvVars("IPADDR")

colVolEnvVars("IPADDR") = IP_Address' Modify the environmental variable with the ip address
'Wscript.Echo colVolEnvVars("IPADDR")

Function GetIP()
  Dim ws : Set ws = CreateObject("WScript.Shell")
  Dim fso : Set fso = CreateObject("Scripting.FileSystemObject")
  Dim TmpFile : TmpFile = fso.GetSpecialFolder(2) & "/ip.txt"
  Dim ThisLine, IP, Mask
  IP = "0"
  MASK = "0"
  If ws.Environment("SYSTEM")("OS") = "" Then
    ws.run "winipcfg /batch " & TmpFile, 0, True
  Else
    ws.run "%comspec% /c ipconfig > " & TmpFile, 0, True
  End If
  With fso.GetFile(TmpFile).OpenAsTextStream
    Do While NOT .AtEndOfStream
      ThisLine = .ReadLine
      if IP = "0" then ' A little logic to make it read the 1st IP address if the machine has multiple IP's
	   If InStr(ThisLine, "Address") <> 0 Then IP = Mid(ThisLine, InStr(ThisLine, ":") + 2)
	 end if
      if MASK = "0" then ' IP address read. Check for valid subnet mask
	   If InStr(ThisLine, "Mask") <> 0 Then 
	     MASK = Mid(ThisLine, InStr(ThisLine, ":") + 2)
		if InStr(MASK, "0.0.0.0") <> 0 Then' Clear ip address if subnet mask is all zero's
		  IP = "0"
		  MASK = "0"
		end if
	   end if
      end if
    Loop
    .Close
  End With
  'WinXP (NT? 2K?) leaves a carriage return at the end of line
  If IP <> "" Then
    If Asc(Right(IP, 1)) = 13 Then IP = Left(IP, Len(IP) - 1)
  End If
  GetIP = IP
  fso.GetFile(TmpFile).Delete 
  fso.CreateTextFile("ip.txt",true).WriteLine(IP)
  Set fso = Nothing
  Set ws = Nothing
End Function
