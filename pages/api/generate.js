import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  //TODO varios prompts
  console.log('p;',generatePromptComedian(animal));

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromptComedian(animal),
      max_tokens: 500,
      temperature: 0.4,
      stop: 'Pergunta:'
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePromptSmart(pergunta) {
  return `Eu sou um bot de resposta a perguntas altamente inteligente.
          Se você me fizer uma pergunta que esteja enraizada na verdade, eu lhe darei a resposta.
          Se você me fizer uma pergunta sem sentido, enganosa ou sem resposta clara, eu vou responder "Desconhecido."

          Pergunta: Qual a expectativa de vida da população geral brasileira?
          Resposta: é 76,6 anos. segundo IBGE (Instituto Brasileiro de Geografia e Estatística)
          Pergunta: quem foi presidente do brasil em 1997?
          Resposta: Fernando Henrique Cardoso, também conhecido como FHC era Filiado ao Partido da Social Democracia Brasileira (PSDB), foi o 34.º presidente da República Federativa do Brasil entre 1995 e 2003.
          Pergunta: ${pergunta}
          Resposta:`;
}
function generatePromptComedian(pergunta) {
  return `
  Eu quero que você aja como um comediante de piadas curtas.
  Fornecerei algum tópico e você usará sua inteligência, criatividade e habilidades de observação para criar uma piada baseada nesses tópico.
  
  Pedido: "Quero uma piada sobre plantas"
  Piada: Qual é a planta favorita dos músicos? A cacta-solo!

  Pedido: "uma piada sobre instrumento musical"
  Piada: Por que os tambores não gostam de contar piadas? Porque eles sempre acabam perdendo o ritmo!

  Pedido: ${pergunta}
  `;
}
