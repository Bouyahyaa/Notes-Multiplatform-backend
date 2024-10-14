import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getAccessToken, sendNotif } from "../utils/notification.js";

function validateEmail(email) {
    var re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

function validatePhone(phone) {
    const re = /[2459][0-9]{7}/;
    return re.test(phone);
}

export const signup = async (req, res) => {
    const { name, email, password, confirmPassword, phone } =
        req.body;

    // Contrôle de saisie email , password , phone

    try {

        if (email == "") {
            return res.status(400).json({ message: "Le champ e-mail est obligatoire" });
        }
        if (password == "") {
            return res.status(400).json({ message: "Le champ password est obligatoire" });
        }
        if (confirmPassword == "") {
            return res.status(400).json({ message: "Le champ confirm password est obligatoire" });
        }
        if (name == "") {
            return res.status(400).json({
                message: "Le champ prénom est obligatoire"
            });
        }

        if (phone == "") {
            return res.status(400).json({ phone: "Le champ téléphone est obligatoire" });
        }

        const existingUser = await User.findOne({
            email,
        });


        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Entrer un email Valide" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Votre mot de passe doit contenir huit caractères, au moins une lettre majuscule et un chiffre",
            });
        }

        if (!validatePhone(phone)) {
            return res.status(400).json({
                message:
                    "Numero de téléphone invalide",
            });
        }


        if (existingUser)
            return res.status(400).json({ message: "Utilisateur existe déjà" });

        if (password !== confirmPassword)
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });

        const hashedPassword = await bcrypt.hash(password, 12);


        await User.create({
            email: email,
            password: hashedPassword,
            name: name,
            phone,
        });

        res.status(200).json({ message: "Success !" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong . " });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    console.log(email,password);

    try {

        if (email == "") {
            return res.status(500).json({ message: "Le champ email est obligatoire" });
        }
        if (password == "") {
            return res.status(500).json({ message: "Le champ password est obligatoire" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser)
            return res.status(404).json({ message: "Email invalide" });


        const isPasswordPCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordPCorrect)
            return res.status(400).json({ message: "Le mot de passe est incorrect" });


        const token = jwt.sign(
            {
                id: existingUser._id,
            },
            "test",
            { expiresIn: "24h" }
        );

        const notificationToken = await getAccessToken();
        sendNotif(notificationToken, {
            data: {
                title: "Welcome Back!",
                body: "Notes Multiplatfrom Team",
            },
            topic: "notes_multiplatform",
          });

        res.status(200).json({ token: token, user: existingUser });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong . " });
        console.log(error);
    }
};