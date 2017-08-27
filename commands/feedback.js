const config = require("../config.json");

module.exports = {
    commands: [
        "feedback",
        "bug",
        "bugs",
        "feature",
        "submit"
    ],
    description: "Submit a bug or a feature request to the developers.",
    usage: "feedback",
    category: "General",
    hidden: false,
    execute: (bot, database, msg, args) => {
        msg.channel.send({
            embed: {
                title: "Feedback",
                color: 3066993,
                description: "To submit feedback, you can fill out the form using the link below and click 'Submit'.",
                fields: [
                    {
                        name: "Form Link",
                        value: config.links.feedback.form,
                        inline: true
                    },
                    {
                        name: "Form Responses",
                        value: config.links.feedback.responses,
                        inline: true
                    }
                ]
            }
        });
    }
};