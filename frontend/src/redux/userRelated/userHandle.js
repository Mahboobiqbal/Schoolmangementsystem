import axios from "axios";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getRequest,
  getFailed,
  getError,
} from "./userSlice";

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    // Map role to correct endpoint
    const endpointRole =
      role === "Learner"
        ? "Learner"
        : role === "Faculty"
          ? "Faculty"
          : role === "Student"
            ? "Learner"
            : role === "Teacher"
              ? "Faculty"
              : role;

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${endpointRole}Login`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.role) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(
      authError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    // Map role to correct endpoint
    const endpointRole =
      role === "Learner"
        ? "Learner"
        : role === "Faculty"
          ? "Faculty"
          : role === "Student"
            ? "Learner"
            : role === "Teacher"
              ? "Faculty"
              : role;

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${endpointRole}Reg`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.schoolName || result.data.institutionName) {
      dispatch(authSuccess(result.data));
    } else if (result.data.school || result.data.institution) {
      dispatch(stuffAdded());
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(
      authError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Map legacy address names to new endpoint names
    const endpoint =
      address === "Student"
        ? "LearnerDetail"
        : address === "Teacher"
          ? "FacultyDetail"
          : address;

    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${endpoint}/${id}`,
    );
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
//         if (result.data.message) {
//             dispatch(getFailed(result.data.message));
//         } else {
//             dispatch(getDeleteSuccess());
//         }
//     } catch (error) {
//         dispatch(getError(error.response?.data?.message || error.message || 'Network Error'));
//     }
// }

export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(
      getError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};

export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/${address}Create`,
      fields,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    dispatch(
      authError(
        error.response?.data?.message || error.message || "Network Error",
      ),
    );
  }
};
