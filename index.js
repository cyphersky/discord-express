const DiscordOauth2 = require("discord-oauth2");
const discordos = new DiscordOauth2();
const bodyParser = require("body-parser");
const config = require("./config");

const express = require('express')
const app = express()
const port = config.port

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App start to port ${port}`)
})


app.get('/joindiscord', async (req, res) => {
  if (req.query.code) {
    console.log('OK!')

    discordos.tokenRequest({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
   
      code: req.query.code,
      scope: "identify guilds.join",
      grantType: "authorization_code",
      
      redirectUri: "https://google.com",
  }).then((data) =>
  {

    discordos.getUser(data.access_token).then(async (userdata) =>
    {

      discordos.addMember({
           accessToken: data.access_token,
           botToken: config.botToken,
           guildId: config.guildId,
           userId: userdata.id,
           roles: [config.roles]
        }).then( (member) =>
        {
          console.log('member joined')
        })
        .catch((err3) =>
        {
          console.log('ERROR #3')
        })
      })
      .catch((err2) =>
      {
        console.log('ERROR #2')
      })

    })
    .catch((err) =>
    {
      console.log('ERROR')
    })
  } else {
    console.log('error')
  }
})
