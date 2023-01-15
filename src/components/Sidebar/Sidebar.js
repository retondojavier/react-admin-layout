import React from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";
import Img1 from 'assets/img/theme/default-avatar.png';
import Brand2 from 'assets/img/brand/logo.png';
import axios from "axios";
import UrlNodeServer from "../../api/routes";
import { ModalMyProfile } from "../Modals/ModalProfile";
import { ModalActivity } from "components/Modals/ModalActivity";

class Sidebar extends React.Component {
  state = {
    collapseOpen: false,
    name: localStorage.getItem("name"),
    lastname: localStorage.getItem("lastName"),
    isAdmin: parseInt(localStorage.getItem("admin")),
    modalProfile: false,
    modalAct: false
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };

  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false
    });
  };

  toggleProfile = () => {
    this.setState({
      modalProfile: !this.state.modalProfile
    })
  }
  toggleActiv = () => {
    this.setState({
      modalAct: !this.state.modalAct
    })
  }
  // creates the links that appear in the left menu / Sidebar
  createLinks = async (routes) => {
    await axios.get(UrlNodeServer.permissionsDir.permissions, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('user-token') }
    })
      .then(res => {
        this.setState({
          data: (
            // eslint-disable-next-line
            routes.map((prop, key) => {
              const id = prop.id

              function check(item) {
                return item.id_permission === id;
              }

              const esta = res.data.body.find(check)
              if (prop.id === 0) {
                return (
                  <NavItem key={key}>
                    <NavLink
                      to={prop.layout + prop.path}
                      tag={NavLinkRRD}
                      onClick={this.closeCollapse}
                      activeClassName="active"
                      style={{ color: "#0081c9", fontWeight: "bold" }}
                    >
                      <i className={prop.icon} />
                      {prop.name}
                    </NavLink>
                  </NavItem>
                );
              } if (prop.id === 1) {
                const admin = localStorage.getItem("admin")
                if (parseInt(admin) === 1) {
                  return (
                    <NavItem key={key}>
                      <NavLink
                        to={prop.layout + prop.path}
                        tag={NavLinkRRD}
                        onClick={this.closeCollapse}
                        activeClassName="active"
                        style={{ color: "#0081c9", fontWeight: "bold" }}
                      >
                        <i className={prop.icon} />
                        {prop.name}
                      </NavLink>
                    </NavItem>
                  );
                }
              } else {
                if (esta) {
                  return (
                    <NavItem key={key}>
                      <NavLink
                        to={prop.layout + prop.path}
                        tag={NavLinkRRD}
                        onClick={this.closeCollapse}
                        activeClassName="active"
                        style={{ color: "#0081c9", fontWeight: "bold" }}
                      >
                        <i className={prop.icon} />
                        {prop.name}
                      </NavLink>
                    </NavItem>
                  );
                } else {
                  return null
                }
              }
            }))
        })
      })
      .catch(() => {
        this.setState({
          exit: true
        })
      })
  };

  componentDidMount() {
    this.createLinks(this.props.routes)
  }

  render() {
    const { logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank"
      };
    }


    return (
      <>
        <ModalMyProfile
          modal={this.state.modalProfile}
          toggle={this.toggleProfile}
        />
        <ModalActivity
          modal={this.state.modalAct}
          toggle={this.toggleActiv}
        />
        <Navbar
          className="navbar-vertical fixed-left navbar-dark bg-ligth"
          expand="md"
          id="sidenav-main"
        >
          <Container fluid>
            {/* Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              style={{ background: "#0081c9" }}
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-icon" />
            </button>
            {/* Brand */}
            {logo ? (
              <NavbarBrand className="pt-0" {...navbarBrandProps}>
                <img alt="..." src={Brand2} style={{ width: "150px", height: "50px" }} />
              </NavbarBrand>
            ) : null}

            {/* User */}
            <Nav className="align-items-center d-md-none">
              <UncontrolledDropdown nav>
                <DropdownToggle nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={Img1}
                      />
                    </span>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Bienvenido!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" onClick={this.toggleProfile}>
                    <i className="ni ni-single-02" />
                    <span>Mi perfil</span>
                  </DropdownItem>
                  {
                    this.state.isAdmin === 1 ?
                      <DropdownItem to="/admin/user-profile" onClick={this.toggleActiv}>
                        <i className="ni ni-calendar-grid-58" />
                        <span>Actividad</span>
                      </DropdownItem> : null
                  }
                  <DropdownItem to="/admin/user-profile" >
                    <i className="ni ni-support-16" />
                    <a href="https://api.whatsapp.com/send?phone=5493512009913&text=Hola%20Javier%2C%20estoy%20teniendo%20problemas%20con%20la%20aplicaci%C3%B3n.%20Solicito%20asistencia%20para%20solucionarlo.%20Gracias!%0AAplicaci%C3%B3n%3A%20%22Municipalidad%20de%20La%20Calera%22" target="_blank" rel="noreferrer" style={{ color: "black" }}><span>Soporte</span></a>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem divider />
                  <DropdownItem href={process.env.PUBLIC_URL + "/auth/login"}>
                    <i className="ni ni-user-run" />
                    <span>Salir</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {/* Collapse */}
            <Collapse navbar isOpen={this.state.collapseOpen}>
              {/* Collapse header */}
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  {logo ? (
                    <Col className="collapse-brand" xs="6">
                      {logo.innerLink ? (
                        <Link to={logo.innerLink}>
                          <img alt={logo.imgAlt} src={Brand2} />
                        </Link>
                      ) : (
                        <a href={logo.outterLink}>
                          <img alt={logo.imgAlt} src={Brand2} />
                        </a>
                      )}
                    </Col>
                  ) : null}
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      type="button"
                      style={{ color: "black" }}
                      onClick={this.toggleCollapse}
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              {/* Navigation */}
              <Nav navbar>{this.state.data}</Nav>
              {/* Divider */}
              <hr className="my-3" />
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

export default Sidebar;
