import Login from "../components/Auth/Login.js";
import { connect } from "react-redux";
import { checkAuthenticateStatus } from "../actions/AuthActions.js";

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkAuthenticateStatus: () => dispatch(checkAuthenticateStatus())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
