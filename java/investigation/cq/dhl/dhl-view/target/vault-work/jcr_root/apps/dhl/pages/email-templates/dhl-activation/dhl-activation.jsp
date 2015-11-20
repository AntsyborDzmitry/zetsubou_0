<%@page session="false" trimDirectiveWhitespaces="true" contentType="text/html;charset=utf-8"%>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<slice:lookup var="templateController" appName="dhlApp" type="<%=com.dhl.components.controller.EmailTemplateController.class%>" />

<html>
<head>
    <cq:include script="/libs/wcm/core/components/init/init.jsp"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<style type="text/css">
        a { color: #189aca; }
</style>
<body style="margin: 0; padding: 0;">
<table width="99%" border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center" valign="top">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                <tr>
                    <td bgcolor="#fecb2f" style="padding: 10px;">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="14px" viewBox="0 0 100 14" enable-background="new 0 0 100 14" xml:space="preserve"><path fill="#d10d1e" d="M0,11.006v0.995h12.446l0.764-0.995H0z M14.647,9.004H0v0.993h13.902L14.647,9.004z M0,13.998h11.018
                            l0.726-1.021H0V13.998z M86.905,12.001H100v-0.993H87.617L86.905,12.001z M85.535,14L100,13.998v-1.021H86.277L85.535,14z
                             M89.041,9.004l-0.732,0.995H100V9.004H89.041z M26.5,8.996c-1.375,0-0.813-0.458-0.583-0.773c0.453-0.62,1.208-1.672,1.652-2.283
                            c0.438-0.603,0.449-0.948-0.446-0.948c-0.863,0-7.594,0-7.594,0l-6.523,9.006c0,0,11.65,0,15.907,0
                            c5.252,0,8.186-3.745,9.088-5.002C38,8.996,27.954,8.996,26.5,8.996z M40.493,9.004c-0.003,0-3.49,4.994-3.49,4.994h9.285
                            l3.571-4.995h-0.167L40.493,9.004z M51.062,13.998h8.448L63,9.004h-8.449C54.549,9.004,51.062,13.998,51.062,13.998z
                             M66.433,9.004c0.001,0-0.661,0.968-0.981,1.435c-1.137,1.644-0.133,3.56,3.576,3.56c4.284,0,14.532,0,14.532,0l3.433-4.994
                            H66.433z M31.555,5.047c-0.441,0.568-1.18,1.556-1.63,2.132c-0.228,0.292-0.64,0.826,0.727,0.826c1.446,0,7.696,0,7.696,0
                            s1.16-1.5,2.132-2.753C41.802,3.548,40.594,0,35.866,0c-4.232,0-18.621,0-18.621,0L14,4.003c0,0,16.642,0,17.5,0
                            C32.389,4.003,31.989,4.487,31.555,5.047z M60.434,0l-3.268,5.001H52.5L56.025,0h-8.808l-6.227,8.006h22.772L69.988,0H60.434z M76.811,8.006L83.01,0h-9.814c-0.004,0-6.204,8.006-6.204,8.006H76.811z"></path></svg>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 5px;">
                        <cq:include path="content" resourceType="foundation/components/text"/>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 15px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td bgcolor="#fecb2f" style="padding: 10px 16px 10px 16px;"
                                                align="center"><a
                                                style="font-family: Helvetica, Arial, sans-serif; text-decoration: none; font-weight: bold; display: inline-block; color: #000;"
                                                x-cq-linkchecker="skip" href="$button_url">${templateController.buttonLabel}</a></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 5px;">
                        <cq:include path="content2" resourceType="foundation/components/text"/>
                        <div>
                            <cq:include path="content3" resourceType="foundation/components/text"/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top" bgcolor="#dbdbdb" style="padding: 0px; padding-top: 5px; padding-bottom: 2px; padding-right: 2px; color: #666;">
                        2015 © DHL International GmbH. All rights reserved.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
