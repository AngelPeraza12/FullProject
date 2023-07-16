// class DoctorGetAllError extends Error {
//     constructor(){
//         super("Failed to retrieve doctor list")
//         this.name = "DoctorGetAllError"
//     }
// }

// class PatientGetAllError extends Error {
//     constructor(){
//         super("Failed to retrieve patient list")
//         this.name = "PatientGetAllError"
//     }
// }

// class DoctorCreationError extends Error {
//     constructor(message: string){
//         super(message)
//         this.name = "DoctorCreationError"
//     }
// }

class CreationError extends Error {
    constructor(message: string, componentName: string){
        super(message)
        this.name = `${componentName}CreationError`
    }
}

class UpdateError extends Error {
    constructor(message: string, componentName: string){
        super(message)
        this.name = `${componentName}UpdateError`
    }
}

class RecordNotFoundError extends Error {
    constructor(){
        super("Record not found yet")
        this.name = "RecordNotFound"
    }
}

class DeleteError extends Error {
    constructor(message: string, componentName: string){
        super(message)
        this.name = `${componentName}DeleteError`
    }
}

class GetAllError extends Error {
    constructor(message: string, componentName: string){
        super(message)
        this.name = `${componentName}GetAllError`
    }
}

export {
    CreationError,
    UpdateError,
    RecordNotFoundError,
    DeleteError,
    GetAllError
}
