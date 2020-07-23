class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        var user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user)=>{
                return user.id !== id;
            });
        }
        return user;
    }

    getUser(id){
        return this.users.filter( (user) =>{
            return user.id === id;
        });
    }

    getUsersList(room){
        var users = this.users.filter( (user) =>{
            return user.room === room;
        });
        
        var nameArray = users.map((user)=>{
            return user.name;
        });

        return nameArray;
    }
}

module.exports = {Users};