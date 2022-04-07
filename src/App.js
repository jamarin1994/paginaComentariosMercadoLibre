import React, { useState, useEffect } from 'react';
import './App.css';
import MaterialTable from "material-table";
import axios from 'axios';
import {Modal, TextField, Button, Icon} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
// import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';
// import SendIcon from '@material-ui/icons/Send';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import tableIcons from "./MaterialTabletIcons";





const columns= [
  { title: 'Nombre', field: 'nombre' },
  { title: 'Email', field: 'email' },
  { title: 'Website', field: 'paginaWeb' },
  // {field: 'version', type: 'numerioc'}
  // { title: 'Ventas Estimadas (millones)', field: 'ventas', type: 'numeric'}

];
const baseUrl="http://localhost:3001/comentarios";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function App() {
  const styles= useStyles();
  const [open, setOpen] = React.useState(false);
  const [data, setData]= useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [comentarioSelecionado, setComentarioSelecionado]=useState({
    id: "",
    nombre: "",
    email: "",
    paginaWeb: "",
    comentario: "",
  })

  // function NumberList(props) {
  //   const numbers = props.numbers;
  //   const listItems = numbers.map((number) =>
  //     <ListItem key={number.toString()}
  //               value={number} />
  //   );
  //   return (
  //     <ul>
  //       {listItems}
  //     </ul>
  //   );
  // }

  const handleClick = () => {
    setOpen(!open);
    if(setOpen !== true){
      // baseUrl={data}
      setData(data);
      data.map((item) =>
      <li key={item.toString()}>
        {/* {item.data} */}
      </li>
    );
      console.log("tomaDatos",data)
    }
  };

  const handleChange=e=>{
    const {name, value}=e.target;
    setComentarioSelecionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  // const validacion =e=>{
  //   const {campo, value}=e.target;
  //   setComentarioSelecionado(prevState=>({
  //     ...prevState,
  //     [campo]: value
      
  //   }));
  // }
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      console.log("response",response.data)
     setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, comentarioSelecionado)
    .then(response=>{
      setData(data.concat(response.data));
      console.log("datosGuardar",response.data)
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+comentarioSelecionado.id, comentarioSelecionado)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(comentario=>{
        if(comentarioSelecionado.id===comentario.id){
          comentario.nombre=comentarioSelecionado.nombre;
          comentario.email=comentarioSelecionado.email;
          comentario.paginaWeb=comentarioSelecionado.paginaWeb;
          comentario.comentario=comentarioSelecionado.comentario;
        }  
      })
      setData(dataNueva);
      console.log("datosModificar",response.data)
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }
  // const listItem  = dataNueva.map((dataNuev) =>
  // <li>{dataNuev}</li>
  // )

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+comentarioSelecionado.id)
    .then(response=>{
      setData(data.filter(comentario=>comentario.id!==comentarioSelecionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarComentario=(comentario, caso)=>{
    setComentarioSelecionado(comentario);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  useEffect(()=>{
    peticionGet();
  }, [])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Creación de comentarios</h3>
         <TextField className={styles.inputMaterial}  label="Nombre" name="nombre" onChange={handleChange}/>
      <br />
        <TextField className={styles.inputMaterial}  label="Email" name="email" onChange={handleChange}/>          
      <br />
        <TextField className={styles.inputMaterial} label="Pagina web" name="paginaWeb" onChange={handleChange}/>
      <br />
        <TextField className={styles.inputMaterial}  label="Comentario" name="comentario" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Guardar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Edición de comentarios</h3>
      <TextField className={styles.inputMaterial}   requerid label="Nombre" name="nombre" onChange={handleChange} value={comentarioSelecionado && comentarioSelecionado.nombre}/>
      <br />
        <TextField className={styles.inputMaterial} requerid label="Email" name="email" onChange={handleChange} value={comentarioSelecionado && comentarioSelecionado.email}/>          
      <br />
        <TextField className={styles.inputMaterial}  requerid label="Pagina web" name="paginaWeb" onChange={handleChange} value={comentarioSelecionado && comentarioSelecionado.paginaWeb}/>
      <br />
        <TextField className={styles.inputMaterial} label="Comentario" name="comentario" onChange={handleChange} value={comentarioSelecionado && comentarioSelecionado.comentario}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Guardar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el comentario <b>{comentarioSelecionado && comentarioSelecionado.id}</b>? </p>
        <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>
      </div>
    </div>
  )
  
  return (
    <div className="App">
          <List
             component="nav"
             aria-labelledby="nested-list-subheader"
      
             className={styles.root}>
               <ListItem button onclik={handleClick}>                 
                  <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
              <ListItemText primary="Listado de comentarios" />
                  {open ? <ExpandLess /> : <ExpandMore />}
               </ListItem>
               <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Starred"
                  />
                </ListItem>
              </List>
            </Collapse>   
        
          </List>
      <br />
      <Button variant="contained" href="#contained-buttons" onClick={()=>abrirCerrarModalInsertar()}>Agregar comentario</Button>
      <br /><br />
     <MaterialTable
          columns={columns}
          data={data}
          title="Datos usuario"
          icons={tableIcons}

          actions={[
            {
              icon: CreateIcon,
              tooltip: 'Editar Comentario',
              onClick: (event, rowData) => seleccionarComentario(rowData, "Editar")
            },
            {
              icon: DeleteIcon,
              tooltip: 'Eliminar Comentario',
              onClick: (event, rowData) => seleccionarComentario(rowData, "Eliminar")
              
            }
          ]}
          options={{
            // icon: SendIcon, 
            // icon: MailOutlineIcon,
            actionsColumnIndex: -1,
            

           
                    }}
          localization={{
            header:{
              actions: "Acciones"
            }
          }}
        />
      <br />
        <TextField className={styles.inputMaterial} label="Version" name="version" onChange={handleChange} value={comentarioSelecionado&&comentarioSelecionado.version}/>
      <br />

        <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>

        
        <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
          {bodyEditar}
        </Modal>

        <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
    </div>
  );
}

export default App;
