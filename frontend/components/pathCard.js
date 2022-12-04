import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon  from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Accordion, AccordionDetails, AccordionSummary, Chip } from '@mui/material';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { fromDanger, stateFromDanger } from '../utils/color';
import { minDiff, toDate, tohhmm } from '../utils/date';
import { useEffect } from 'react';

export default function PathCard({path}){

  const GenStep = (stop, path) => {
    return ([<Step key={0}><Typography fontWeight={700} color={fromDanger(stop.danger)}>{stop.min} min</Typography></Step>,
        <Step key={1}><StepLabel icon={1} sx={{fontSize:24}} error={stop.danger === 2 ? true : false}>
          <Typography sx={{fontSize:16, fontWeight:700}}>{`${tohhmm(stop.date)}${path && path.delay !== 0 ? ` (+${path.delay})`: ""} ${stop.name}`}</Typography>
          </StepLabel></Step>])
  }

  const GenChip = (stop) => {
    return <Chip label={stop.name} color={stateFromDanger(stop.danger)}  />
  }
  

  if(path.type === "bus")path.from.min = minDiff(path.from.date, new Date());
  else path.to.min = minDiff(path.to.date, new Date());
  

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography className='iconContainingText' sx={{ fontSize: 24, fontWeight:700}} color="text.secondary" gutterBottom>
          {path.type === "bus" ? `${tohhmm(path.from.date)}${path.delay ? ` (+${path.delay})` : ""}` : ""} <ArrowForwardRoundedIcon /> {tohhmm(path.to.date)}
          </Typography>

          <Accordion elevation={0}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box display="flex" gap={1}>
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
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  )
}