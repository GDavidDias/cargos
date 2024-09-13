const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE MOVIMIENTOS ASIGNADAS 
    //SEGUN EL NIVEL INDICADO EN EL ID_LISTADO_VAC_MOV -> LO PASO POR BODY
    const{idListadoVacMov} = req.body;
    console.log('que trae idListadoVacMov: ', idListadoVacMov);

    try{
        //TRAE LAS VACANTES QUE SI TENGAN UNA FECHA DE ASIGNACION, SON LAS ASIGNADAS
        //TAMBIEN LAS QUE ESTEN ACTIVAS -> QUE vm.obs_desactiva sea NULL
        //WHERE am.datetime_asignacion IS NOT NULL 
        //y que el subselect de asignacion_mov solo traiga las asignaciones ACTIVAS -> am.obs_desactiva IS NULL
        //DESPUES VER SI SE IMPLEMENTA EL ESTADO DE ASIGNACION, SOLO TRAER COMO DISPONIBLES UNA SIGNACION RECHAZADA, YA QUE LAS ACEPTADAS ESTAN ASIGNADAS O LAS PENDIENTES ESTAN EN PROCESO DE ASIGNACION.

        const [result] = await pool.query(`SELECT vm.id_vacante_mov, vm.id_listado_vac_mov, vm.orden, vm.establecimiento, vm.obs_establecimiento, vm.region, vm.departamento, vm.localidad, vm.cargo, vm.turno, vm.modalidad, vm.cupof, vm.id_especialidad, vm.datetime_creacion, vm.obs_desactiva, vm.zona, vm.resolucion, am2.datetime_asignacion , am2.id_estado_asignacion
            FROM vacantes_mov AS vm
            LEFT JOIN (SELECT am.id_vacante_mov, am.datetime_asignacion , am.id_estado_asignacion FROM asignacion_mov AS am WHERE am.obs_desactiva IS NULL) AS am2 ON vm.id_vacante_mov = am2.id_vacante_mov
            WHERE am2.datetime_asignacion IS NOT NULL 
            AND (vm.obs_desactiva IS NULL OR vm.obs_desactiva = "")
            AND vm.id_listado_vac_mov=${idListadoVacMov}
            ORDER BY vm.id_vacante_mov ASC`);

        console.log('que trae result getAllVacantesMovAsignadas: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};