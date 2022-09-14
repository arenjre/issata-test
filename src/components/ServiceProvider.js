import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios"

import { Pagination } from "antd"



const ServiceProvider = () => {
  const [defaultLanguages, setDefaultLanguages] = React.useState('en');
  const [languages, setLanguages] = React.useState();
  const [serviceProviders, setServiceProviders] = React.useState();
  const [total, setTotal] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [postPerPage, setostPerPage] = React.useState(12)

  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };


  React.useEffect(() => {
    axios.get(`https://staging.cms.golden-dreams.org/api/v1/localization/languages`)
      .then(function (response) {
        setLanguages(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  React.useEffect(() => {
    axios.get(`https://staging.cms.golden-dreams.org/api/v1/service-providers?lang=${defaultLanguages}`)
      .then(function (response) {
        setServiceProviders(response.data)
        setTotal(response.data.length)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [defaultLanguages])


  var finalArr = null
  React.useEffect(() => {
    if (serviceProviders) {
      if (value !== "") {
        finalArr = serviceProviders.find(obj => {
          if(obj.name.toLowerCase().includes(value)){
            return obj
          }
        });
      }
      else{
        finalArr = serviceProviders
      }
    }
  }, [value])
  
  const languageChangeHandler = (event: SelectChangeEvent) => {
    setDefaultLanguages(event.target.getAttribute("data-value"));
  };
  
  
  debugger


  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPage = serviceProviders ? serviceProviders.slice(indexOfFirstPage, indexOfLastPage) : null
  return (
    <>

      <Container>
        <Grid style={{ textAlign: 'center', padding: "auto" }}>
          <h1 style={{ borderBottom: "2px solid black" }}>Service Providers</h1>
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'end' }}>

          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >

          </Box>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={defaultLanguages}
              label="Language"
              onClick={languageChangeHandler}
            >

              {
                languages ? languages.map((lng, index) => {
                  return (
                    <MenuItem key={index} value={lng.code}>{lng.name_en}</MenuItem>
                  )
                })
                  : null
              }
            </Select>
          </FormControl>
        </div>

      </Container>




      <Container style={{ marginTop: "20px" }}>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>

            {
              serviceProviders ?
                currentPage.map((sp, index) => {
                  return (
                    <>
                      <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                        <Card sx={{ maxWidth: 345, minHeight: 360 }}>
                          <CardActionArea style={{ margin: "auto 0" }}>
                            <center>
                              <CardMedia
                                component="img"
                                style={{ width: "170px", height: "170px", display: "flex", justifyContent: "center", marginTop: "10px" }}
                                image={sp.image ? sp.image : require('../images/service provider.jpg')}
                                alt="green iguana"
                              />
                            </center>
                            <CardContent>
                              <Typography gutterBottom component="div" style={{ fontWeight: 600 }}>
                                {sp.name}
                              </Typography>
                              <Typography gutterBottom component="div" style={{ fontSize: "12px" }}>
                                Email : {sp.email ? sp.email : "No email"}
                              </Typography>

                              <a href={sp.website} style={{ fontSize: "12px", cursor: "pointer" }} target="_blank">
                                Website : {sp.website}
                              </a>
                              <Grid style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                                <Typography gutterBottom component="div" style={{ fontSize: "12px" }}>
                                  Rating Score : {sp.rating_score ? sp.rating_score : "0"}
                                </Typography>
                                <Typography gutterBottom component="div" style={{ fontSize: "12px" }}>
                                  Rating Count : {sp.rating_count}
                                </Typography>
                              </Grid>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>

                    </>
                  )
                })
                : null
            }
          </Grid>
        </Box>
      </Container>
      <Container style={{ padding: "20px 0", display: "flex", justifyContent: "end" }}>
        <Pagination
          onChange={(value) => setPage(value)}
          current={page}
          pageSize={postPerPage}
          total={total}
          showSizeChanger={false}
        />
      </Container>

    </>
  )

}

export default ServiceProvider;