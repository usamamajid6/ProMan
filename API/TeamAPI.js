const Team = require('../Schemas/TeamSchema');


const getLastId = async () => {
    try {
        const result = await Timeline.find()
            .sort({ _id: -1 })
            .limit(1);
        if(result.length===0){
            return 0;
        }else{
            return result[0]._id;
        }
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewTeam = async (name, description, leader_id) => {
    try {
        let _id= await getLastId();
        _id = parseInt(_id);
        ++_id;
        // let _id = 1;
        
        const team = new Team({
            _id,
            name,
            description,
            leader: parseInt(leader_id)
        });
        try {
            const result = await Team.create(team);
            return result;
        } catch (e) {
            console.log("Problem in Adding New Team.", e);
            return e;
        }

    } catch (e) {
        console.log("Problem in Getting Last Id for New Team.", e);
        return e;
    }
}

const getTeamById = async (_id) => {
    try {

        const team = Team.findOne({ _id: parseInt(_id) }).populate('leader');
        return team;
    } catch (e) {
        console.log("Problem in getTeamById.", e);
        return e;
    }
}

const addMember = () => {

}


//update Efficiency Score and Total Tasks Of Member(ESATTOM)
const updateESATTOM = () => {

}

module.exports = { createNewTeam, getTeamById, addMember, updateESATTOM };