import { Request, Response } from "express"
import { PatientController, PatientControllerImpl } from "../api/components/pacientes/controller"
import { PatientService } from "../api/components/pacientes/service"
import { Patient, PatientReq } from "../api/components/pacientes/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('PatientController', () => {
    let patientSerivce: PatientService
    let patientController: PatientController

    beforeEach(() => {
        patientSerivce = {
            getAllPatients: jest.fn(),
            createPatient: jest.fn(),
            getPatientById: jest.fn(),
            updatePatient: jest.fn(),
            deletePatient: jest.fn()
        }

        patientController = new PatientControllerImpl(patientSerivce)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe('getAllPatients', () => {
        it('should get all patients', async () => {
            // Mock Process
            const patients: Patient[] = [
                { id_patient: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 },
                { id_patient: 2, nombre: 'Alveiro', apellido: 'Tarsisio', especialidad: 'Ortopedia', consultorio: 101 },
            ];

            (patientSerivce.getAllPatients as jest.Mock).mockResolvedValue(patients)

            // Method execution
            await patientController.getAllPatient(mockReq, mockRes)

            // Asserts
            expect(patientSerivce.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(patients)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (patientSerivce.getAllPatients as jest.Mock).mockRejectedValue(error)

            await patientController.getAllPatient(mockReq, mockRes)

            expect(patientSerivce.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error getting all patients" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createPatient', () => {
        it('should create a new patient and return info', async () => {
            // Mock Process
            const patientRes: Patient = { id_paciente: 1, nombre: 'Carlos', apellido: 'Caceres', identificacion:"1033767358"}
            const patientReq: PatientReq = {
                nombre: 'Carlos',
                apellido: 'Caceres',
                identificacion: '1033767358'
            };
            (mockReq.body as patientReq) = patientReq;
            (patientSerivce.createpatient as jest.Mock).mockResolvedValue(patientRes)

            // Method execution
            await patientController.createpatient(mockReq, mockRes)

            // Asserts
            expect(patientSerivce.createpatient).toHaveBeenCalledWith(patientReq)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.body) = {};
            (patientSerivce.createpatient as jest.Mock).mockRejectedValue(error)

            await patientController.createpatient(mockReq, mockRes)

            expect(patientSerivce.createpatient).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getpatientById', () => {
        it('should get patient by id', async () => {
            // Mock Process
            const patientRes: patient = { id_patient: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 };
            (mockReq.params) = { id: "1" };
            (patientSerivce.getpatientById as jest.Mock).mockResolvedValue(patientRes)

            // Method execution
            await patientController.getpatientById(mockReq, mockRes)

            // Asserts
            expect(patientSerivce.getpatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if patient not found', async () => {
            (mockReq.params) = { id: "1" };
            (patientSerivce.getpatientById as jest.Mock).mockResolvedValue(null)

            await patientController.getpatientById(mockReq, mockRes)

            expect(patientSerivce.getpatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (patientSerivce.getpatientById as jest.Mock).mockRejectedValue(error)

            await patientController.getpatientById(mockReq, mockRes)

            expect(patientSerivce.getpatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve patient" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})