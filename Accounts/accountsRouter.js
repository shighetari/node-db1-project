const express = require('express')
const db = require('../data/dbConfig')
const { from, where } = require('../data/dbConfig')
const router = express.Router()

router.get("/", (req, res) => {
    db.select("*")
    .from("accounts")
    .then(accounts => {
        res.status(200).json({accounts})
    })
    .catch(error => {
        handleError(error, res)
    })
})
router.use("/:id", validatedByID)

router.get("/:id", (req, res) => {
    const id = req.params

    db.select("*")
    .from("accounts")
    .where(id)
    .first() // accounts[0] grabbing first element from the array
    .then( acc => {
        res.status(200).json({acc})
    }).catch(error => {
        handleError(error, res)
    })
})

router.post("/", (req, res) => {
    db("accounts")
    .insert(req.body)
    .then(id => {
        db("accounts")
        .where({id})
        .first()
        .then(newpost => {
            res.status(200).json(newpost)
        })
        // res.status(200).json(id)
    })
    .catch(error => {
        handleError(error,res)
    })

})

router.delete("/:id", (req, res) => {
    const id = req.params
    db("accounts")
    .where(id)
        .then(deletedPost => {
            db("accounts").where(id).first().del()
            .then(accountsRemoved => {
                if (accountsRemoved > 0) {
                    res.status(200).json({deletedPost, accountsRemoved})
                } else {
                    res.status(404).json({message: "your account was not located in our data base."})
                }
               
            })
        })
        .catch(error => {
            handleError(error, res)
        })
    })

//     .del()
//     .then(count => {
//         if (count > 0) {
//             res.status(200).json(count)
//         } else {
//             res.status(404).json({message: "there was no record to delete"})
//         }
//     }).catch(error => {
//         handleError(error, res)
//     })
// })

    router.put("/:id", (req, res) => {
        const id = req.params
        const changes = req.body

        db("accounts")
        .where(id)
        .update(changes)
        .then(numOfRecordsUpdated => {
            if (numOfRecordsUpdated > 0) {
                res.status(200).json({numOfRecordsUpdated, changes})
            } else {
                res.status(404).json({message: "there was no record to update"})
            }
        })
        .catch(error => {
            handleError(error, res)
        })
    })

//helper function

function handleError(error, res){
    console.log("error", error)
    res.status(500).json({errMessage: error.message})
}

//middleware
function validatedByID(req, res, next){
    const id = req.params
    db("accounts")
    .where(id)
    .then(ID => {
        console.log(ID[0].id)
        if(!ID[0].id) {
            res.status(404).json({message: `The account with the ID ${ID} could not be found in our data base` })
        } else {
            next()
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({message: "The account info could not be retrieved"})
    })
}
module.exports = router