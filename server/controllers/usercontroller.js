const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    try{
    let { email, password } = req.body.user;
    
    let User = await UserModel.create ({
        email,
        password: bcrypt.hashSync(password,13),
    });

    let token = jwt.sign({id: User.id, email: User.email}, process.env.JWT_SECRET, {expiresIn:60 * 60 *24});

    res.status(201).json({
        message: "User successfully registered",
        user: User,
        sessionToken: token
    });
} catch (err) {
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "Email already in use",
        });
    } else{
    res.status(500).json({
        message: "Failed to register user",
    });
}
}
});

router.post("/login" , async (req, res) => {
    let { email, password } = req.body.user;

    try{
    let loginUser = await UserModel.findOne({
        where: {
            email: email,
        },
    });
    if (loginUser){

        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(200).json({
        user: loginUser,
        message: "User successfully logged in!",
        sessionToken: token
    });
} else {
    res.status(401).json({
        message: "Incorrect email or password"
    })
}
} else {
    res.status(401).json({
        message:"Incorrect email or password"
    });
}
} catch (error) {
    res.status(500).json({
        message: "Failed to log user in"
    })
}
});
   

router.delete("/delete/:id", async (req,res) => {
    const userID = req.user.id

    try{
        const query = {
            where: {
                userID:userID
            }
        }
        await UserModel.destroy(query)
        res.status(200).json({
            message: "User deleted"
        })
    } catch (err){
        res.status(500).json({
            message: `Failed to delete user ${err}`
        })
    }
})




module.exports = router;