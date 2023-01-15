import React, { useContext } from 'react'
import UrlNodeServer from '../../../api/routes'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"
import swal from 'sweetalert'
import alertsContext from 'context/alerts';
import actionsBackend from 'context/actionsBackend';
import '../shimmer.css';

const UserRow = ({
    id,
    item,
    setDetBool,
    refreshToggle,
    setIdDetail,
    first,
    page,
    setPage,
    setPermissionsBool,
    setIdUser,
    setUserName
}) => {
    const { newAlert, newActivity } = useContext(alertsContext)
    const { axiosDelete, loadingActions } = useContext(actionsBackend)

    const deleteUser = async (e, id, name, first, page) => {
        e.preventDefault()
        swal({
            title: "Eliminar al usuario " + name + "!",
            text: "¿Está seguro de eliminar a este usuario? Esta desición es permanente.",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                let backPage = false
                if (willDelete) {
                    const response = await axiosDelete(UrlNodeServer.usersDir.users, id)
                    if (!response.error) {
                        if (first) {
                            if (page > 1) {
                                backPage = true
                            }
                        }
                        newActivity(`Se ha eliminado alusuario ${item.name} ${item.lastname} (id: ${item.user})`)
                        newAlert("success", "Usuario eliminado con éxito!", "")
                        if (backPage) {
                            setPage(parseInt(page - 1))
                        } else {
                            refreshToggle()
                        }
                    } else {
                        newAlert("danger", "Hubo un error!", "Intentelo nuevamente. Error: " + response.errorMsg)
                    }
                }
            });
    }

    const details = (e, id) => {
        e.preventDefault()
        setIdDetail(id)
        setDetBool(true)
    }

    const givePermissions = (e, id, name) => {
        e.preventDefault()
        setUserName(name)
        setIdUser(id)
        setPermissionsBool(true)
    }

    return (
        <tr key={id} className={loadingActions ? "shimmer" : ""} >
            <td style={{ textAlign: "center" }}>
                {item.name + " " + item.lastname}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.email}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.tel}
            </td>
            <td className="text-right">
                <UncontrolledDropdown>
                    <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        color=""
                        onClick={e => e.preventDefault()}
                    >
                        <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => details(e, item.id)}
                        >
                            <i className="fas fa-edit"></i>
                            Editar
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => givePermissions(e, item.id, item.name + " " + item.lastname)}
                        >
                            <i className="fas fa-id-card"></i>
                            Dar Permisos
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => deleteUser(e, item.id, item.name + " " + item.lastname, first, page)}
                        >
                            <i className="fas fa-trash-alt"></i>
                            Eliminar
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default UserRow