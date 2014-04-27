Sub DoEncryptCommand()
  Dim Content
  Dim Message
  Dim EncryptData As EncryptedData
  Set EncryptData = new ActiveXObject("CAPICOM.EncryptedData")
  'set passwd
  EncryptData.SetSecret "123456", CAPICOM_SECRET_PASSWORD
  EncryptData.Algorithm.Name = CAPICOM_ENCRYPTION_ALGORITHM_3DES
  EncryptData.Algorithm.KeyLength = CAPICOM_ENCRYPTION_KEY_LENGTH_MAXIMUM
  ' Load content of file to be enveloped.
  LoadFile ".\data.txt", Content
  ' Now Encrypt it.
  EncryptData.Content = Content
  Message = EncryptData.Encrypt(CAPICOM_ENCODE_BINARY)
  tmpstr = Message
  ' Finally, save Encrypted file
  SaveFile ".\data.txt", Message
  ' Free resources.
  Set EncryptData = Nothing
  MsgBox "encrypt ok"
End Sub ' End DoEncryptCommand

var Enc = {
	Do:function(){
		var content = '';
		var message = '';
		var encdata = new ActiveXObject("CAPICOM.EncryptedData");
		encdata.SetSecret = '123456';
		encdata.Algorithm.Name = 1;
		encdata.Algorithm.keyLength = 3;
	}
};


Sub DoDecryptCommand()
  Dim Message
  Dim EncryptData
  ' Create the EncryptData object.
  Set EncryptData = CreateObject("CAPICOM.EncryptedData")
  ' Load the enveloped message.
  LoadFile ".\data.txt", Message
  EncryptData.SetSecret "123456", CAPICOM_SECRET_PASSWORD
  ' Now decrypt it.
  EncryptData.Decrypt (Message)
  ' Finally, save decrypted content to out FileNames(1).
  SaveFile ".\data.txt", EncryptData.Content
  ' Free resources.
  Set EncryptData = Nothing
  MsgBox "decrypt ok"
End Sub ' End DoDecryptCommand

Sub LoadFile(FileName, Buffer)
  Dim TheBytes() As Byte
  ReDim TheBytes(FileLen(FileName) - 1)
  IFile = FreeFile
  Open FileName For Binary Access Read As #IFile
  Get #IFile, , TheBytes()
  Close #IFile
   Buffer = TheBytes
End Sub ' End LoadFile

Sub SaveFile(FileName, Buffer)
  Dim out() As Byte
  ReDim out(Len(Buffer) - 1)
  out = Buffer
  IFile = FreeFile
  Open FileName For Binary Access Write As #IFile
  Put #IFile, , out
  Close #IFile
End Sub ' End SaveFile

Private Sub Decrypt_Click()
DoDecryptCommand
End Sub

Private Sub Encrypt_Click()
DoEncryptCommand
End Sub