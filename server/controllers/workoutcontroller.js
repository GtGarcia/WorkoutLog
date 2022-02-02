const { Router } = require("express");
const Express = require("express");
const router = Express.Router();
const { validateJWT } = require("../middleware");
const { WorkoutModel } = require("../models");

router.get("/practice", validateJWT, (req,res) => {
    res.send("Hey This is a pracitce route")
});

router.post("/create", validateJWT,async (req,res) => {
    const { description, definition, result } = req.body.work;
    // const { id } = req.user;
    const  workEntry = {
        description,
        definition,
        result,
        owner_id: req.user.id

    }
    try {
        const newWorkout = await WorkoutModel.create(workEntry);
        res.status(200).json(newWorkout);
    }catch (err) {
        res.status(500).json({ error: err});
    }
});

router.get("/", async (req, res) => {
    try{
        const entries = await WorkoutModel.findAll();
        res.status(200).json(entries);
    }catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get("/mine", validateJWT, async (req,res) => {
    let { id } = req.user;
    try{
        const userWorkoutLog = await WorkoutModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userWorkoutLog);
    }catch(err) {
        res.status(500).json({ error: err });
    }
});

router.put("/update/:id", validateJWT, async (req,res) => {
    const { description, definition, result} = req.body.work;
    const workId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: workId,
            owner_id: userId
        }
    };

    const updatedWork = {
        description: description,
        definition: definition,
        result: result
    };
    try {
        const update = await WorkoutModel.update(updatedWork, query);
        res.status(200).json( 
            {message: "Work Log Entry Updated!"}
            );
    }catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete("/delete/:id",validateJWT,async (req,res) =>{
    const ownerId = req.user.id;
    const workId = req.params.id;

    try{
        const query = {
            where: {
                id: workId,
                owner_id: ownerId
            }
        };

        await WorkoutModel.destroy(query);
        res.status(200).json({ message: "Work Log Entry Removed"});
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

router.get("/about", (req,res) => {
    res.send("About Route!")
});
module.exports = router;