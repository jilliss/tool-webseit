import Head from 'next/head'
import {Container, Row, Card, Button} from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import {useEffect, useState} from "react";
import {Mate} from "next/dist/compiled/@next/font/dist/google";
import {Meta} from "next/dist/lib/metadata/generate/meta";
import Script from "next/script";


export default function Home() {
    const [isLoading, setLoading] = useState(false);

    // useEffect(() => {
    //     function simulateNetworkRequest() {
    //         return new Promise((resolve) => setTimeout(resolve, 2000));
    //     }
    //
    //     if (isLoading) {
    //         simulateNetworkRequest().then(() => {
    //             setLoading(false);
    //         });
    //     }
    // }, [isLoading]);
    const transLog = (() => {
        let textVa = document.getElementById("log").value;
        // 获取带问号的SQL语句
        let statementStartIndex = textVa.indexOf('Preparing: ');
        let statementEndIndex = textVa.length - 1;
        for (let i = statementStartIndex; i < textVa.length; i++) {
            if (textVa[i] == "\n") {
                statementEndIndex = i;
                break;
            }
        }
        let statementStr = textVa.substring(statementStartIndex + "Preparing: ".length, statementEndIndex);
        //获取参数
        let parametersStartIndex = textVa.indexOf('Parameters: ');
        let parametersEndIndex = textVa.length;
        for (let i = parametersStartIndex; i < textVa.length; i++) {
            if (textVa[i] == "\n") {
                parametersEndIndex = i;
                break;
            } else {
                // console.log(textVa[i]);
            }
        }
        let parametersStr = textVa.substring(parametersStartIndex + "Parameters: ".length, parametersEndIndex);

        let parametersStrArr = parametersStr.split(",");

        for (let i = 0; i < parametersStrArr.length; i++) {
            let tempStr = parametersStrArr[i].substring(0, parametersStrArr[i].indexOf("("));
            if (tempStr == '') {
                tempStr = "null";
            }
            // 如果数据中带括号需要判断参数类型
            let typeStr = parametersStrArr[i].substring(parametersStrArr[i].indexOf("(") + 1, parametersStrArr[i].indexOf(")"));
            if (typeStr == "String" || typeStr == "Timestamp" || typeStr == "LocalDateTime" || typeStr == "DateTime" || typeStr == "Date") {
                statementStr = statementStr.replace("?", "'" + tempStr.trim() + "'");
            } else {
                statementStr = statementStr.replace("?", tempStr.trim());
            }
        }
        console.log(document.getElementById("sql"))
        document.getElementById("sql").innerHTML = statementStr;
        copyToClip(statementStr);
    });

    const copyToClip = ((content) => {
        let aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        if ("" != content) {
            alert("复制成功，直接粘贴即可");
        } else {
            alert("转换失败");
        }


    });
    return (

        <Container className="md-container align-content-center">
            <Head>
                <title>java mybatis sql log auto fill </title>
                <Meta name="description" content="Automatically populate sql with mybatis logs and parameters"></Meta>
                <link rel="icon" href="/favicon-32x32.png"/>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6046059224675624"
                        crossOrigin="anonymous"></script>
            </Head>
            <Container>
                <Form>
                    <Button letiant="primary"
                            disabled={isLoading}
                            onClick={!isLoading ? transLog : null}>Conversion</Button>{' '}
                    <Form.Group className="mb-3">
                        <Form.Label>Paste the mybatis log here</Form.Label>
                        <Form.Control as="textarea" id="log" rows={3}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>SQL after conversion</Form.Label>
                        <Form.Control as="textarea" id="sql" rows={3}/>
                    </Form.Group>
                </Form>
            </Container>
        </Container>
    )
}
