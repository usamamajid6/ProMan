const Attachment = require('../Schemas/AttachmentSchema');
const bcrypt=require('bcrypt');


const getLastId=async()=>{
    try {
        const result = await Attachment.find()
            .sort({ _id: -1 })
            .limit(1);
        return result[0]._id;
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewAttachment=async (name,path,member_id)=>{
    try {
        let _id=await getLastId();
        _id=parseInt(_id);
        ++_id; 
        // let _id=1;
        const attachment = new Attachment({
            _id,
            name,
            path,
            member:parseInt(member_id)
        });
        try {
            const result=await Attachment.create(attachment);
            return result;
        } catch (e) {
            console.log("Problem in Adding New Attachment.",e);
            return e;
        }
        
    } catch (e) {
        console.log("Problem in Getting Last Id for New Attachment.",e);
            return e;
    }
}

const getAttachmentById=async (_id)=>{
    try {
       
        const attachment = Attachment.findOne({_id:parseInt(_id)}).populate('member');
        return attachment;
    } catch (e) {
        console.log("Problem in getAttachmentById.",e);
            return e;
    }
}

module.exports={createNewAttachment,getAttachmentById};