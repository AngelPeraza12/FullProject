import { Appointment } from './model'
import { Request, Response } from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
import { AppointmentCreationError, AppointmentDeleteError, AppointmentGetAllError, AppointmentUpdateError, RecordNotFoundError } from '../../../utils/customErrors'
import { createAppointmentSchema } from './validations/Appointment.validations'


export interface AppointmentController {
    getAllAppointments(req: Request, res: Response): void
    createAppointment(req: Request, res: Response): void  
    getAppointmentById(req: Request, res: Response): void 
    updateAppointment(req: Request, res: Response): void   
    deleteAppointment(req: Request, res: Response): void  
}

export class AppointmentControllerImpl implements AppointmentController {
    private  AppointmentService:  AppointmentService
    
    constructor ( AppointmentService: AppointmentService ){
        this.AppointmentService = AppointmentService
    }
    public  async getAllAppointments(req: Request, res: Response): Promise<void> {
        try {
            const Appointments = await this.AppointmentService.getAllAppointments()
            res.status(200).json(Appointments)
            
        } catch (error) {
            res.status(400).json({message: "Error getting all Appointments"})
        }
    }
    public  createAppointment (req: Request, res: Response): void {
    
        const {error, value } = createAppointmentSchema.validate(req.body)

        if (error){
            res.status(400).json({message: error.details[0].message})
        } else{
            this.AppointmentService.createAppointment(value)
            .then(
                (Appointment) =>{
                    res.status(201).json(Appointment)
                },
                (error) =>{
                    logger.error(error)
                    if (error instanceof AppointmentCreationError){
                        res.status(400).json({
                            error_name: error.name,
                            message: "Failed Creating a Appointment"
                        })
                    } else {
                        res.status(400).json({
                            message: "Internal Server Error"
                        })
                    }
                }
            )
        }

    }

    public async getAppointmentById (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const Appointment =  await this.AppointmentService.getAppointmentById(id)
            if (Appointment) {
                res.status(200).json(Appointment)
            } else {
                throw new RecordNotFoundError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to retrieve Appointment"})
            }
        }
    }

    public async updateAppointment (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const AppointmentReq = req.body
            const Appointment =  await this.AppointmentService.updateAppointment(id, AppointmentReq)
            if (Appointment) {
                res.status(200).json(Appointment)
            } else {
                throw new AppointmentUpdateError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else  if (error instanceof AppointmentUpdateError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to update Appointment"})
            }
        }
    }

    public async deleteAppointment (req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            await this.AppointmentService.deleteAppointment(id)
            
            res.status(200).json({message: `Appointment was deleted successfully`})
        } catch (error) {
            logger.error(error)
            if (error instanceof AppointmentDeleteError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: "Failed to delete Appointment"})
            }
        }
    }
}