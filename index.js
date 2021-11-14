const { client } = require("./database")

const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    if (req.cookies["uname"]) res.redirect("/dashboard")
    res.render("login")
})
app.get("/signup", (req, res) => {
    if (req.cookies["uname"]) res.redirect("/dashboard")
    res.render("signup")
})
app.get("/dashboard", (req, res) => {
    if (req.cookies["uname"]) res.render("dashboard", { name: req.cookies["uname"] })
    else res.redirect("/")
})
app.get("/logout", (_, res) => {
    res.clearCookie("uname")
    res.redirect("/")
})

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    await client.query(
        `INSERT INTO users(name, email, password) VALUES($1, $2, $3);`,
        [name, email, password]
    );
    res.redirect("/")
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const ans = await client.query(
        `SELECT name FROM users WHERE email=$1 AND password=$2;`,
        [email, password]
    );

    if (ans.rows.length > 0) {
        res.cookie("uname", ans.rows[0].name);
        res.redirect("/dashboard")
    } else {
        res.status(403).send("Invalid Input")
    }
})

const main = async () => {
    // Database connection
    await client.connect();
    app.listen(process.env.APP_PORT || 3000, () => console.log("We are live!"))
}

main().catch(console.error)
