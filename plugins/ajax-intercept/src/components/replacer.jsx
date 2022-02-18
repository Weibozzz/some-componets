import React, {useState,useEffect} from 'react';
import ReactJson from 'react-json-view';
import { Button, Input, Switch, Collapse, Popover } from 'antd'
import {proxy, unProxy, hook} from "ajax-hook";
import './styles.less'

const { TextArea } = Input;
const { Panel } = Collapse;

const storage = {
  get(key){
    return localStorage.getItem(key)
  },
  set(key, value){
    localStorage.setItem(key, value)
  }
}
export default function () {
  const [txt, setTxt] = useState()
  const [open, setOpen] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [urls, setUrls] = useState([])

  const [client, setClient] = useState('web')
  const [env, setEnv] = useState('fat')
  const [type, setType] = useState('1')
  const [series, setSeries] = useState('k')
  const [site, setSite] = useState('-1')


  const decryptUrl = (url) => {
    // 解密 url
    return url;
  }
  const decryptResponse = (response, timestamp) => {
    // 解密 response
    return response;
  }
  const handleJSONEditorChange = ({updated_src: src}) => {
    try {
      let txt = JSON.stringify(src);
      // 加密
      // setTxt(txt)
    } catch (err) {
    }
  }
  const getJson = (response) => {
    let result = ''
    try {
      // 解密
    } catch (err) {
      result = ''
    }
    // console.log('解密', response);
    return response;
  }
  const onSearch = e => {
    setSearchVal(e.target.value)
  };
  useEffect(() => {
    try {
      proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
          handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
          handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
          console.log('onResponse', response);
          const url = response.config.url
          setTxt(JSON.stringify(response.response))
          const res = decryptResponse(
            response,
          )
          setUrls((data) => {
            return [
              ...data,
              {
                url: decryptUrl(url),
                response: { a: 1 },
                txt: JSON.stringify(response.response),
              }
            ];
          })
          handler.next(response)
        }
      })
    } catch (err) {
      console.error('解密插件', err)
    }
  }, [])

  const handleDecryptUrl = (url) => {
    // 解密 url
    return url;
  }
  return (
    <div className="uhou-container-uuu">
      <div className='tr'>
        <Switch
          checkedChildren="关闭解密"
          unCheckedChildren="解密接口"
          defaultChecked={open}
          onChange={(checked) => setOpen(checked)}
        />
      </div>
      <div className={
        open ? `show` : 'hide'
      }>
        <Button
          type='primary'
          onClick={() => setUrls([])}
        >清除</Button>

        <div className='url-input'>
          <Popover content={'取值web、h5'} title="client">
            <Input
              className='input'
              placeholder='client'
              defaultValue={storage.get('client') || 'web'}
              onInput={(e) => {
                setClient(e.target.value)
                storage.set('client', e.target.value)
              }}
            />
          </Popover>
          <Popover content={'取值fat、prod'} title="env">
            <Input
              className='input'
              placeholder='env'
              defaultValue={storage.get('env') || 'fat'}
              onInput={(e) => {
                setEnv(e.target.value)
                storage.set('env', e.target.value)
              }}
            />
          </Popover>

          <Popover content={'编码格式'} title="type">
            <Input
              className='input'
              placeholder='type'
              defaultValue={storage.get('type') || '1'}
              onInput={(e) => {
                setType(e.target.value)
                storage.set('type', e.target.value)
              }}
            />
          </Popover>
          <Input
            className='input'
            placeholder='k/s系'
            defaultValue={storage.get('series') || 'k'}
            onInput={(e) => {
              setSeries(e.target.value)
              storage.set('series', e.target.value)
            }}
          />
          <Input
            className='input'
            placeholder='站点id'
            defaultValue={storage.get('site') || '-1'}
            onInput={(e) => {
              setSite(e.target.value)
              storage.set('site', e.target.value)
            }}
          />
        </div>
        {/*<div>
         <Input
         allowClear
         placeholder="搜索接口"
         onChange={onSearch} />
         </div>*/}
        <div className="collapse-panel">
          <Collapse>
            {
              urls.filter(v => v.url.includes(searchVal))
                .map((v, index) => {
                  return (
                    <Panel
                      header={v.url}
                      key={index}>
                      <TextArea
                        placeholder=""
                        onChange={(e) => {
                          // setTxt(e.target.value)
                        }}
                        value={v.txt}
                        autoSize={{ minRows: 2, maxRows: 2 }}
                      />
                      <div>
                        <Button
                          type='primary'
                          onClick={() => {
                            const url = handleDecryptUrl(v.url)
                            window.open(url)
                          }}
                        >解密url</Button>

                        解密json:
                      </div>
                      <div className='json-wrapper'>
                        <ReactJson
                          src={v.response}
                          name={false}
                          collapsed={1}
                          displayDataTypes={false}
                          collapseStringsAfterLength={12}
                          onEdit={handleJSONEditorChange}
                          onAdd={handleJSONEditorChange}
                          onDelete={handleJSONEditorChange}
                        />
                      </div>
                    </Panel>
                  );
                })
            }
          </Collapse>
        </div>
      </div>
    </div>
  );
}
