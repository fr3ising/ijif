import base64
encoded = base64.b64encode(open("public/foro.png", "rb").read())

print encoded
