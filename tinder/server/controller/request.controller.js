import Request from "../model/request.model.js";

// request sent
export const sent = async (req, res) => {
  try {
    const sender_id = req.id;
    const { receiver_id, status } = req.body;
    if (!(sender_id && receiver_id && status)) {
      return res.status(400).json({
        success: false,
        message: "Somtimg is missing",
      });
    }

    const request = await Request.create({
      sender_id: sender_id,
      receiver_id: receiver_id,
      status: status,
    });
    return res.status(201).json({
      success: true,
      message: "Request sent",
    });
  } catch (error) {
    console.log(error);
  }
};

// request accept or reject
export const chnageStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { status, requestId } = req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (!(status && requestId)) {
      return res.status(400).json({
        success: false,
        message: "somthing is missing",
      });
    }
    const updatedStatus = { status };
    const request = await Request.findByIdAndUpdate(requestId, updatedStatus, {
      new: true,
    });
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "No request found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `Request ${status}`,
    });
  } catch (error) {
    console.log(error);
  }
};
