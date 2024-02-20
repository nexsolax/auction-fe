import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppbarDesktop from "./appbarDesktop";

export default function Appbar(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    return(
        <>
         <AppbarDesktop matches={matches}/>
        </>
    );
}