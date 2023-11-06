const { Router, request, response } = require("express");
const router = Router();
const ChatManager = require("../dao/controllers/mongo/ChatManager");
const chatModel = require("../dao/models/chat.model");


/*primero se agrega mensajes mediante el req.body luego se hace el get
ejemplo para agregar un mensaje:
{
    "user": "usuario1@gmail.com",
    "message": "mi primer mensaje"
}
*/
router.post("/", async (request, response) => {
    const chatManager = new ChatManager;
    const {user, message} = request.body;
    const messageChat = await chatManager.addMessage(user, message);
    return response.json({
        ok: true,
        message: 'mensaje agregado correctamente',
        messageChat: messageChat
    })
})

router.get("/", async (request, response) => {
    const chatManager = new ChatManager;
    const listChat = await chatManager.getMessage();
    response.status(200).render("chat", {messages: listChat});
});

module.exports = router;