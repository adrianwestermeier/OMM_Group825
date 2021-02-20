module.exports = {

postUserToDb: async function(db, user) {
    const users = db.get('users');
  
    users.insert(user)
      .then((us) => {
        console.log("[database] inserted user");
      }).catch((err) => {
        console.log(err)
      });
},
  
getUsersFromDb: async function(db){
    const users = db.get('users');
    const myUsers = await users.find({});
    return myUsers;
},

/* posts a new template to the template collection */
postTemplateToDb: async function(db, template) {
    const templates = db.get('templates');
  
    templates.insert(template)
      .then((temp) => {
        console.log("[database] inserted template");
      }).catch((err) => {
        console.log(err)
      });
  },
  
  /* posts a new meme to the generatedMemes collection */
  postNewMemeToDb: async function(db, meme) {
    const memes = db.get('generatedMemes');
  
    memes.insert(meme)
      .then((mem) => {
        console.log("[database] inserted new meme");
      }).catch((err) => {
        console.log(err)
      });
  },
  
  /* gets an entry from the template collection with the name "name" */
  getEntry: async function(db, name, collectionName) {
    const collection = db.get(collectionName);
    // only the name projection will be selected
    collection.findOne({name: name}, 'name').then((entry) => {
      if (entry) {
            let myName = entry.name;
            console.log("[database] found entry " + myName);
            return entry;
      }
    });
    return;
  }

};