
export async function sucessResponse(res, message="",data=null) {
    return res.status(200).json({
        status: 200,
        error: false,
        message,
        data,
    });
}
export async function errorResponse(res,status, message="") {
    return res.status(200).json({
        status,
        error: true,
        message,
        data:null,
    });
}


export async function errorResponseHandller(req,res) {
    return res.status(403).json({ message: "not found" });
}