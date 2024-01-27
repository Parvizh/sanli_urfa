import {
  Box,
  Button,
  DropDown,
  DropDownItem,
  DropDownMenu,
  DropDownTrigger,
} from '@adminjs/design-system';
import { ActionProps, useCurrentAdmin } from 'adminjs';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';

const ViewAddresses = (props: ActionProps) => {
  const { record } = props;
  const [currentAdmin] = useCurrentAdmin();
  const [user, setUser] = useState(null);

  const url = '/user/' + record.params.id;

  useEffect(() => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Bearer ' + currentAdmin.token,
        },
      })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    user && (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DropDown>
          <DropDownTrigger>
            <Button>View addresses</Button>
          </DropDownTrigger>
          <DropDownMenu>
            {user.addresses.length > 0 ?
              user.addresses.map((address: any, index: number) => {
                return (
                  <DropDownItem>
                    <DropDown>
                      <DropDownTrigger>
                        <Button>Address #{index + 1}</Button>
                      </DropDownTrigger>
                      <DropDownMenu>
                        <DropDownItem>
                          <pre>{JSON.stringify(address, null, '\t')}</pre>
                        </DropDownItem>
                      </DropDownMenu>
                    </DropDown>
                  </DropDownItem>
                );
              }) : <DropDownItem>There are no addresses</DropDownItem>}
          </DropDownMenu>
        </DropDown>
        <br/>
      </div>
    )
  );
};

export default ViewAddresses;
