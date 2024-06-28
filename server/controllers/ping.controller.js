const ping = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Ping Check Successful",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { ping };
