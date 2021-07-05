const dotenv = require('dotenv');
settings = dotenv.config().parsed;
// Connection URI
const uri = settings.DB_URL

const {MongoClient} = require('mongodb');

async function main(uri){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
   
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        const db = client.db("beanie_db").collection("saved-searches")
        //////////
        testObject = {
          price: 900
        }
        const efind = await db.find(
          {
              $expr: {
                  $function: {
                      body: function(searchCriteria) {
                          return terms.some(term => term['field_name'] != 'price')
                      },
                      args: ["$terms"],
                      lang: "js"
                  }
              }
          }
      )
        //const savedSearches = await fetchAllSearches(client)
        //items = savedSearches.filter(isMatchWithListingItem(this));
        a = await efind.toArray()
        b = a
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main(uri).catch(console.error);


async function fetchAllSearches(client){
  const result = await client.db("beanie_db").collection("saved-searches").find()
  return await result.toArray();
}

class SavedSearch {
  constructor(operation, fieldName, value) {
    this.operation = operation;
    this.fieldName = fieldName;
    this.value = value;
  }
  executeFilter(item){
    const itemFieldValue = item[this.fieldName]
    if (item[this.fieldName] == undefined){
      return
    }
    var query
    switch (this.operation) {
      case "bigger_than":
        return (itemFieldValue > this.value)
      case "less_than":
        return (itemFieldValue < this.value)
      case "equal":
        return (itemFieldValue == this.value)
      default:
        return false
    }
  }
}

function isMatch(listingItem, savedSearchItem){
  return savedSearchItem.terms.some(
    (term) => executeFilter(term.operation, term.field_name, term.value, listingItem)
  )

}


function executeFilter(operation, fieldName, value, listingItem) {
  const itemFieldValue = listingItem[fieldName]
    if (listingItem[fieldName] == undefined){
      return false
    }
    switch (operation) {
      case "bigger_than":
        return (itemFieldValue > value)
      case "less_than":
        return (itemFieldValue < value)
      case "equal":
        return (itemFieldValue == value)
      default:
        return false
    }
}

testObject = {
  price: 900
}
const isMatchWithListingItem = isMatch.bind(null, testObject)