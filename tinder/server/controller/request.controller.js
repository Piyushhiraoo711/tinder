import Request from "../model/request.model.js";
import User from "../model/user.model.js";

// request sent
export const sent = async (req, res) => {
  try {
    const senderId = req.id;
    const { receiverId, status } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    const alreadySentRequest = await Request.findById(senderId);

    if (!alreadySentRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Already sent a request" });
    }

    if (!(sender && receiver)) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    const request = await Request.create({
      senderId: senderId,
      receiverId: receiverId,
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
    const { status, requestId, senderId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!(status && requestId && senderId)) {
      return res.status(400).json({
        success: false,
        message: "somthing is missing",
      });
    }

    const acceptor = await User.findById(userId);
    const requestor = await User.findById(senderId);

    acceptor.receivedRequests = await acceptor.receivedRequests.filter(
      (id) => id.toString() !== senderId
    );
    acceptor.connections.push(senderId);

    requestor.sentRequests = await requestor.sentRequests.filter(
      (id) => id.toString !== userId
    );
    requestor.connections.push(userId);

    await acceptor.save();
    await requestor.save();

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
