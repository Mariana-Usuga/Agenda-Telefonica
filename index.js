const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express();

app.use(morgan('tiny'))
app.use(cors());
app.use(express.json());

const URI ='mongodb+srv://marktpul_user:SVO87P7U0cchznst@marktcluster.ikcnf.mongodb.net/Agenda-telefonica?retryWrites=true&w=majority'

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('MongoDB Connected');

contactosSchema = mongoose.Schema({
  name: String,
  number: Number,
})
const Contacto = mongoose.model("Contacto", contactosSchema);

app.get('/info', async (req, res) => {
  try {
    const contactos = await Contacto.find()
    if(contactos.length === 0){
      return res.status(404).json({ response: 'no contacts' })      
    }
    res.json(contactos)
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
  }) 
app.post('/', async (req, res) => {
  try {
    const { name, number } = req.body
    if (!name || !number ) {
      return res.status(422).json({ response: 'Missing values in the body' })
    }

    const contactos = await Contacto.find()
    const existingNumber = contactos.filter(contacto => contacto.number === number)
    if(existingNumber.length > 0){
      return res.status(409).json({ response: 'contact number already exists' })
    }
    const existingName = contactos.filter(contacto => contacto.name === name)
    if(existingName.length > 0){
      return res.status(409).json({ response: 'contact name already exists' })
    }

    const newContacto = await Contacto.create({ name, number })
    res.status(201).json(newContacto)  
  }catch(err){
      res.status(500).json({ error: 'Somenthign went wrong..' })
    }
  })
app.get('/api/persons/:id', async (req, res) => {
  const contacto = await Contacto.findById({ _id: req.params.id })
  res.json(contacto)
})

app.delete('/api/persons/:id', async (req, res) => {
  try{
    const { id } = req.params
    await Contacto.deleteOne({ _id: id })
    res.json({ response: 'contact deleted' })
  }catch(err) {
    res.status(500).json({ error: 'Somenthign went wrong..' })
  }
  }) 
app.patch('/api/persons/:id', async (req, res) => {
  const { id } = req.params
  const { name, number } = req.body
  if(!name && !number){
    return res.status(422).json({ response: 'Missing values in the body' })
  }
  const contacto = await Contacto.findById({ _id: id })
  await contacto.updateOne({ name, number })
  res.json({ response:'cambio exitoso' }).status(204).end()
  })

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running 🤖 at http://localhost:${PORT}/`);
});