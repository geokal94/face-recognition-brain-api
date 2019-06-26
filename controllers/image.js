const clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: '601dad170fa841f088417daa3c0b0047'
   });

   const handleApiCall = (req,res,db) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(res => res.status(400).json('unable to work with API'))
}
   

const handleImage = (req,res,db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}