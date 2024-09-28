import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import OpenAI from "openai"

dotenv.config({path: '../config.env'})

const openai = new OpenAI({
    //key
})

const app = express()
app.use(cors({origin:"*"}))
app.use(express.json());

app.get("/", async (req,res) =>{
    res.status(200).send({
        message:"From the Endpoint"
    })
})

app.post("/", async (req,res) =>{
    try {
        const prompt = req.body.prompt;
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-0125",
            prompt: prompt,
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "text"
            },
          });
          console.log(response.data)
          res.status(200).send({
            bot: response.data.choices[0].text
          })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: error
        })
    }
})

app.listen(3000, () => console.log("Server is running on port http://localhost:3000"))