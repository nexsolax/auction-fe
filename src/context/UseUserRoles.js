import { useEffect, useState } from "react";

export function UseUserRoles() {
    const user = JSON.parse(localStorage.getItem('loginUser'));
    const roles = user?.role;

return [roles];
}
  