import Typography from '@mui/material/Typography';
//import { BookmarkBorderIcon } from '@mui/icons-material'
import { ArrowForward, BookmarkBorder, Bookmark } from '@mui/icons-material';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Chip, Container, FormControlLabel } from '@mui/material';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { fromDanger, stateFromDanger } from '../utils/color';
import { minDiff, toDate, tohhmm } from '../utils/date';
import { useEffect, useState } from 'react';

export default function PathCard({path}){
  const [kept, setKept] = useState(path.kept);

  const GenStep = (stop, path) => {
    return ([<Step key={0}><Typography fontWeight={700} color={fromDanger(stop.danger)}>{stop.min} min</Typography></Step>,
        <Step key={1}><StepLabel icon={1} sx={{fontSize:24}} error={stop.danger === 2 ? true : false}>
            <Typography onClick={stop.refURL ? () => {window.open(stop.refURL)} : null} sx={{fontSize:16, fontWeight:700, cursor:"pointer"}}>
              {`${tohhmm(stop.date)}${path && path.delay !== 0 ? ` (+${path.delay})`: ""} ${stop.name}`}
            </Typography>
        </StepLabel></Step>])
  }

  const GenChip = (stop) => {
    return <Chip label={stop.name} color={stateFromDanger(stop.danger)}  />
  }

  const keepPath = (event) => {
    let paths = localStorage.getItem("paths");
    if(paths === null)paths = {};
    else paths = JSON.parse(paths);

    setKept(event.target.checked);
    path.kept = event.target.checked;
    console.log(paths);
    if(event.target.checked){
      paths[path.hash] = path;
    }else{
      delete paths[path.hash];
    }
    
    localStorage.setItem("paths", JSON.stringify(paths));
    console.log(paths);
  }
  

  if(path.type === "bus")path.from.min = minDiff(path.from.date, new Date());
  else path.to.min = minDiff(path.to.date, new Date());
  

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Box display="flex" justifyContent={"space-between"} alignItems="center">
            <Typography className='iconContainingText' sx={{ fontSize: 24, fontWeight:700}} color="text.secondary" >
            {path.type === "bus" ? `${tohhmm(path.from.date)}${path.delay ? ` (+${path.delay})` : ""}` : ""} <ArrowForward /> {tohhmm(path.to.date)}
            </Typography>
            <Checkbox checked={kept ? true : false} onChange={keepPath} icon={<BookmarkBorder />}checkedIcon={<Bookmark />} sx={{ '& .MuiSvgIcon-root': { fontSize: 24} }} />
          </Box>
          
          
          {/* wrap with div to avoid unwanted border */}
          <div><Accordion elevation={0} >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box display="flex" gap={1} >
                {path.type === "bus" ? [GenChip(path.from),GenChip(path.mid)] : null}
                {GenChip(path.to)}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stepper orientation='vertical' activeStep={7}>
                <Step><StepLabel icon={1} sx={{fontSize:24}}><Typography sx={{fontSize:16}}>徳山高専</Typography></StepLabel></Step>
                {path.type === "bus" ? [GenStep(path.from, path),GenStep(path.mid, path)] : null}
                {GenStep(path.to)}
              </Stepper>
            </AccordionDetails>
          </Accordion></div>
        </CardContent>
      </Card>
    </Box>
  )
}