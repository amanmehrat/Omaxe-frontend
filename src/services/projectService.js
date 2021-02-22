import { useGet, usePost, usePut } from "../../utils/hooks";

const { run: CreateProject } = usePost("/projects/AddProject",
    null,
    {
        onResolve: (data) => {
            return Promise.resolve(res.data);
            //errorCtx.setSuccess(true);                
        },
        onReject: (err) => {
            return Promise.reject(err);
        }
    });



const SaveProject = async () => {
    try {
        return await axios.get('/fetchuser')

    } catch (ex) {
        return ex;
    }
}
const UpdateProject = async (user) => {
    try {
        const res = await axios.post('/register', user)
        return Promise.resolve(res.data);
    } catch (ex) {
        return Promise.reject(ex.response?.data?.error);
    }
}
const login = async (email, password) => {
    try {
        const res = await axios.post('/login', { email, password })
        return Promise.resolve(res.data);
    } catch (ex) {
        return Promise.reject(ex.response?.data?.error);
    }
}
export const userService = {
    saveProject,
    login,
    updateProject
};
