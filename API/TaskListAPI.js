const TaskList = require('../Schemas/TaskListSchema');

const getLastId = async () => {
    try {
        const result = await TaskList.find()
            .sort({ _id: -1 })
            .limit(1);
        if (result.length === 0) {
            return 0;
        } else {
            return result[0]._id;
        }
    } catch (e) {
        console.log("Error while getting last Last ID.", e);
        return e;
    }
}

const createNewTaskList = async (name, project_id) => {
    try {
        let _id = await getLastId();
        _id = parseInt(_id);
        ++_id;
        const taskList = new TaskList({
            _id,
            name,
            project: parseInt(project_id)
        });
        try {
            const result = await TaskList.create(taskList);
            return result;
        } catch (e) {
            console.log("Problem in Adding New TaskList.", e);
            return e;
        }

    } catch (e) {
        console.log("Problem in Getting Last Id for New TaskList.", e);
        return e;
    }
}

const getTaskListById = async _id => {
    try {

        const taskList = TaskList.findOne({ _id: parseInt(_id) })
        .populate('project')
        .populate('tasks');
        return taskList;
    } catch (e) {
        console.log("Problem in getTaskListById.", e);
        return e;
    }
}

const addTask = async (_id, task_id) => {
    try {
        const result = await Task.updateOne({ _id }, { $push: { tasks: task_id } });
        return result;
    } catch (e) {
        console.log("Problem in addTask", e);
        return e;
    }
}

module.exports = {
    createNewTaskList,
    getTaskListById,
    addTask
};