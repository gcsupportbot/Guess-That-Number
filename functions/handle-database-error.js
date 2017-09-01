module.exports = (error, msg) => {
    if (msg) msg.channel.send({
        embed: {
            title: "Error!",
            color: 0xE50000,
            description: "An error occured when attempting to execute query in database!"
        }
    });
    console.error(error);
    if (error.fatal) process.exit();
};