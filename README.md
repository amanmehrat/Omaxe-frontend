
- [ Auth ](#Auth)
- [ Flats ](#Flats)
- [ CAM History ](#CAM-History)
- [ User Master](#User-Master)

## Auth

#### Resgister (/auth/register)

HTTP Method : POST

###### Request : 
```
{
    "name" : "Sandip",
    "email" : "sk1957339@gmail.com",
    "phoneNumber" : "8178877227",
    "password" : "Asdf@1234"
}
```
###### Response : 
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ98iv8HbpTRhg7aR6Q",
        "user": {
            "id": "ef1e5299-8f1a-4eec-b455-19cec494fd7c",
            "name": "Sandip",
            "email": "sk1957339@gmail.com",
            "phoneNumber": "8178877227",
            "isEmailVerified": false,
            "isPhoneNumberVerified": false,
            "role": null,
            "isDisable": false
        }
    }
}
```

#### LogIn (/auth/login)

HTTP Method : POST

###### Request : 
```
{
    "phoneNumberOrEmail" : "8178877227",
    "password" : "Asdf@1234"
}
```
###### Response : 
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ98iv8HbpTRhg7aR6Q",
        "user": {
            "id": "ef1e5299-8f1a-4eec-b455-19cec494fd7c",
            "name": "Sandip",
            "email": "sk1957339@gmail.com",
            "phoneNumber": "8178877227",
            "isEmailVerified": false,
            "isPhoneNumberVerified": false,
            "role": null,
            "isDisable": false
        }
    }
}
```

## Flats

#### Get flats for a project (/flats)

###### Request :

###### Headers
```
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiYTlkYmRiYjUtMWEyMy00MDkzLWFhNTYtMTE0ODgxNjY1N2QzIiwibmFtZSI6IlR1c2hhciBTaGFybWEiLCJlbWFpbCI6InR1c2hhckBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6Ijk5NTg2NzU2MTUiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lTnVtYmVyVmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpudWxsLCJpc0Rpc2FibGUiOmZhbHNlfSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJhOWRiZGJiNS0xYTIzLTQwOTMtYWE1Ni0xMTQ4ODE2NjU3ZDMifX0.8ZAph7m6PU_VjTEHstp6pHzTIUaChM_ADZDnYPRkIZY"
```

```
{
    "projectId" : "e96a0074-204a-41e6-b029-89d4d08d7e25"
}
```

###### Response :
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "flats": [
            {
                "id": "7f936a59-941b-47c3-860d-fd9805e22bcd",
                "residentName": "Sonia Salaria",
                "ownerName": "Sonia Salaria",
                "projectId": "e96a0074-204a-41e6-b029-89d4d08d7e25",
                "propertyType": 0,
                "floorNumber": "UGF",
                "flatNumber": "AIFC/UGF/523U",
                "dateOfPossession": "2017-06-12",
                "blockNumber": "02",
                "blockIncharge": "Harshish Singh",
                "area": 1646,
                "meterNumber": "28784",
                "project": {
                    "name": "Ambrosia"
                }
            },
            {
                "id": "7f936a59-941b-47c3-860d-fd9805e22bcd",
                "residentName": "Sonia Salaria",
                "ownerName": "Sonia Salaria",
                "projectId": "e96a0074-204a-41e6-b029-89d4d08d7e25",
                "propertyType": 0,
                "floorNumber": "UGF",
                "flatNumber": "AIFC/UGF/523U",
                "dateOfPossession": "2017-06-12",
                "blockNumber": "02",
                "blockIncharge": "Harshish Singh",
                "area": 1646,
                "meterNumber": "28784",
                "project": {
                    "name": "Ambrosia"
                }
            }
        ]
    }
}
```

#### Get a single flat by id (/flats/getFlat)

###### Request :

###### Headers
```
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiYTlkYmRiYjUtMWEyMy00MDkzLWFhNTYtMTE0ODgxNjY1N2QzIiwibmFtZSI6IlR1c2hhciBTaGFybWEiLCJlbWFpbCI6InR1c2hhckBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6Ijk5NTg2NzU2MTUiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lTnVtYmVyVmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpudWxsLCJpc0Rpc2FibGUiOmZhbHNlfSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJhOWRiZGJiNS0xYTIzLTQwOTMtYWE1Ni0xMTQ4ODE2NjU3ZDMifX0.8ZAph7m6PU_VjTEHstp6pHzTIUaChM_ADZDnYPRkIZY"
```
```
{
    "flatId" : "7f936a59-941b-47c3-860d-fd9805e22bcd"
}
```

###### Response :
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "flats": [
            {
                "id": "7f936a59-941b-47c3-860d-fd9805e22bcd",
                "residentName": "Sonia Salaria",
                "ownerName": "Sonia Salaria",
                "projectId": "e96a0074-204a-41e6-b029-89d4d08d7e25",
                "propertyType": 0,
                "floorNumber": "UGF",
                "flatNumber": "AIFC/UGF/523U",
                "dateOfPossession": "2017-06-12",
                "blockNumber": "02",
                "blockIncharge": "Harshish Singh",
                "area": 1646,
                "meterNumber": "28784",
                "project": {
                    "name": "Ambrosia"
                }
            }
        ]
    }
}
```

## CAM History

#### Get All CAM details for a flat by id (camDetails/getCamById)

###### Request :

###### Headers :
```
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiYTlkYmRiYjUtMWEyMy00MDkzLWFhNTYtMTE0ODgxNjY1N2QzIiwibmFtZSI6IlR1c2hhciBTaGFybWEiLCJlbWFpbCI6InR1c2hhckBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6Ijk5NTg2NzU2MTUiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lTnVtYmVyVmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpudWxsLCJpc0Rpc2FibGUiOmZhbHNlfSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJhOWRiZGJiNS0xYTIzLTQwOTMtYWE1Ni0xMTQ4ODE2NjU3ZDMifX0.8ZAph7m6PU_VjTEHstp6pHzTIUaChM_ADZDnYPRkIZY"
```

```
{
    "flatId" : "7f936a59-941b-47c3-860d-fd9805e22bcd",
    "fetchBy" : 0
}
```

###### Response :
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "camDetail": {
            "amount": 2913,
            "billDate": "2020-10-01",
            "billNumber": "A/M/OCT/20/F/01",
            "id": "40b38582-9893-4d94-9121-67a9fe79e21d",
            "month": 10,
            "paidOn": "2021-01-15",
            "paidVia": 0,
            "receiptNumber": "ABCD1234",
            "year": 2020,
            "flatId": "7f936a59-941b-47c3-860d-fd9805e22bcd",
            "projectId": "e96a0074-204a-41e6-b029-89d4d08d7e25",
        }
    }
}
```

#### Get a month's CAM details for a flat by id (camDetails/getCamById)

###### Request :

###### Headers :
```
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiYTlkYmRiYjUtMWEyMy00MDkzLWFhNTYtMTE0ODgxNjY1N2QzIiwibmFtZSI6IlR1c2hhciBTaGFybWEiLCJlbWFpbCI6InR1c2hhckBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6Ijk5NTg2NzU2MTUiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lTnVtYmVyVmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpudWxsLCJpc0Rpc2FibGUiOmZhbHNlfSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJhOWRiZGJiNS0xYTIzLTQwOTMtYWE1Ni0xMTQ4ODE2NjU3ZDMifX0.8ZAph7m6PU_VjTEHstp6pHzTIUaChM_ADZDnYPRkIZY"
```

```
{
    "flatId" : "7f936a59-941b-47c3-860d-fd9805e22bcd",
    "fetchBy" : 1,
    "fetchData" : {
        "month" : 10,
        "year" : 2021
    }
}
```

###### Response :
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "camDetail": {
            "amount": 2913,
            "billDate": "2020-10-01",
            "billNumber": "A/M/OCT/20/F/01",
            "id": "40b38582-9893-4d94-9121-67a9fe79e21d",
            "month": 10,
            "paidOn": "2021-01-15",
            "paidVia": 0,
            "receiptNumber": "ABCD1234",
            "year": 2020,
            "flatId": "7f936a59-941b-47c3-860d-fd9805e22bcd",
            "projectId": "e96a0074-204a-41e6-b029-89d4d08d7e25",
        }
    }
}
```

#### Get a year's CAM details for a flat by id (camDetails/getCamById)

###### Request :

###### Headers :
```
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiYTlkYmRiYjUtMWEyMy00MDkzLWFhNTYtMTE0ODgxNjY1N2QzIiwibmFtZSI6IlR1c2hhciBTaGFybWEiLCJlbWFpbCI6InR1c2hhckBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6Ijk5NTg2NzU2MTUiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpc1Bob25lTnVtYmVyVmVyaWZpZWQiOmZhbHNlLCJyb2xlIjpudWxsLCJpc0Rpc2FibGUiOmZhbHNlfSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJhOWRiZGJiNS0xYTIzLTQwOTMtYWE1Ni0xMTQ4ODE2NjU3ZDMifX0.8ZAph7m6PU_VjTEHstp6pHzTIUaChM_ADZDnYPRkIZY"
```

```
{
    "flatId" : "7f936a59-941b-47c3-860d-fd9805e22bcd",
    "fetchBy" : 2,
    "fetchData" : {
        "year" : 2020
    }
}
```

###### Response :
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "camDetail": {
            "amount": 2913,
            "billDate": "2020-10-01",
            "billNumber": "A/M/OCT/20/F/01",
            "id": "40b38582-9893-4d94-9121-67a9fe79e21d",
            "month": 10,
            "paidOn": "2021-01-15",
            "paidVia": 0,
            "receiptNumber": "ABCD1234",
            "year": 2020,
            "flatId": "7f936a59-941b-47c3-860d-fd9805e22bcd",
            "projectId": "e96a0074-204a-41e6-b029-89d4d08d7e25",
        }
    }
}
```

## User Master 
- Only for admin

#### Add New User (/user)

HTTP Method : POST

###### Request : 
```
{
    "name" : "Ram3",
    "email" : "ram3@gmail.com",
    "phoneNumber" : "3111122222",
    "password" : "Asdf@1234",
    "role" : "admin"
}
```
###### Response : 
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "user": {
            "id": "b85b40c3-c27d-4d0c-b73a-906228c02d1e",
            "name": "Ram3",
            "email": "ram3@gmail.com",
            "phoneNumber": "3111122222",
            "isEmailVerified": false,
            "isPhoneNumberVerified": false,
            "role": "admin",
            "isDisable": false
        }
    }
}
```

#### Get all User (/user)

HTTP Method : GET

###### Response : 
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "user": [
            {
                "id": "51ff8f49-d32a-4639-a107-2adc6435e639",
                "name": "Ram1",
                "email": "ram1@gmail.com",
                "phoneNumber": "2111122222",
                "role": "member",
                "isPhoneNumberVerified": false,
                "isEmailVerified": false,
                "isDisable": false,
                "created_at": "2021-01-19T12:54:13.538018+00:00"
            },
            {
                "id": "b85b40c3-c27d-4d0c-b73a-906228c02d1e",
                "name": "Ram3",
                "email": "ram3@gmail.com",
                "phoneNumber": "3111122222",
                "role": "admin",
                "isPhoneNumberVerified": false,
                "isEmailVerified": false,
                "isDisable": false,
                "created_at": "2021-01-19T12:54:28.820927+00:00"
            }
        ]
    }
}
```

#### Update User (/user/:userId)

HTTP Method : PUT

###### Request : 
```
{
    "name" : "Ram3",
    "email" : "ram31@gmail.com",
    "phoneNumber" : "8178877227",
    "password" : "Asdf@1234",
    "role" : "admin",
    "isDisable" : false
}
```
###### Response : 
```
{
    "meta": {
        "code": 200,
        "message": "Success!",
        "isError": false
    },
    "data": {
        "user": {
            "id": "b7eda8f9-8592-480b-8d53-05a7a9eeb96e",
            "name": "Ram3",
            "email": "ram31@gmail.com",
            "phoneNumber": "8178877227",
            "isEmailVerified": false,
            "isPhoneNumberVerified": false,
            "role": "admin",
            "isDisable": false
        }
    }
}
```
