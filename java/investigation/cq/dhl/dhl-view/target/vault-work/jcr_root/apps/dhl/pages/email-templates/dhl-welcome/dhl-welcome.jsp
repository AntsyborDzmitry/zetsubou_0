<%@page session="false" trimDirectiveWhitespaces="true" contentType="text/html;charset=utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<slice:lookup var="templateController" appName="dhlApp" type="<%=com.dhl.components.controller.EmailTemplateController.class%>" />

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <cq:include script="/libs/wcm/core/components/init/init.jsp"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<style type="text/css">
    a { color: #189aca; }
</style>
<body bgcolor="#f1f1f1" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="border-collapse: collapse; padding: 0; margin: 0; background-color: #e6e6e6; font-family: Arial; font-size: 12px;">
    <table style="background-color:#f1f1f1;" cellpadding='0' cellspacing='0' border='0'>
        <tr>
            <td width="50%"></td>
            <td>
                <table width='600' cellpadding='0' cellspacing='0' border='0' style="border-collapse: collapse; padding: 0; margin: 0; text-align: left; background-color: #ffffff;">
                    <tr>
                        <td>
                        <!-- --------------------web page url----------------------------------------- -->
                        <table style="background-color:#f1f1f1;" cellpadding='0' cellspacing='0' border='0' width="600">
                            <tr>
                                <td height="10"></td>
                            </tr>
                            <tr>
                                <td height="11" style="text-align:center; font-size:11px; color:#189aca; font-family: Arial;">
                                    <span style="font-size:11px; font-family: sans-serif;"><a href="#" style="color: #189aca;"><cq:include path="topLink" resourceType="foundation/components/text"/></a></span>
                                </td>
                            </tr>
                            <tr>
                                <td height="10"></td>
                            </tr>
                        </table>
                        <!-- --------------------web page url end ----------------------------------------- -->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <!-- --------------------header ----------------------------------------- -->
                            <table style="background-color:#fecb2f;" cellpadding='0' cellspacing='0' border='0' width="600">
                                <tr>
                                    <td height="30"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <table style="background-color:#fecb2f;" cellpadding='0' cellspacing='0' border='0' width="600">
                                            <tr>
                                                <td width="15"></td>
                                                <td width="200">
                                                    <a href="#">
                                                        <img src="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}/etc/clientlibs/dhl/global/public/img/dhl_email_logo.gif" alt="">
                                                    </a>
                                                </td>
                                                <td width="370" align="right">
                                                    <a href="#" style="color: #333333; font-size: 10px; font-family: sans-serif; text-decoration: none;">
                                                        <span style="color: #333333; font-size: 10px; font-family: sans-serif; text-decoration: none;"><cq:include path="headerLink" resourceType="foundation/components/text"/></span>
                                                    </a>
                                                </td>
                                                <td width="15"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="30"></td>
                                </tr>
                            </table>
                            <!-- -------------------- header end ----------------------------------------- -->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <!-- --------------------email content----------------------------------------- -->
                            <table style="background-color:#ffffff;" cellpadding='0' cellspacing='0' border='0' width="600">
                                <tr>
                                    <td width="15"></td>
                                    <td width="570">
                                        <table style="background-color:#ffffff;" cellpadding='0' cellspacing='0' border='0' width="570">
                                            <tr>
                                                <td height="30"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong style="color: #333333; font-size: 18px; font-family: sans-serif;"><cq:include path="congratTitle" resourceType="foundation/components/text"/></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="15"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style="color: #333333; font-size: 14px; font-family: sans-serif;"><cq:include path="congratText" resourceType="foundation/components/text"/></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="30"></td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#d5f1d5">
                                                    <table style="background-color:#d5f1d5;" cellpadding='0' cellspacing='0' border='0' width="570">
                                                        <tr>
                                                            <td height="15"></td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center">
                                                                <strong style="color: #333333; font-size: 14px; font-family: sans-serif;"><cq:include path="welcomeStatus" resourceType="foundation/components/text"/></strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="15"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="30"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table style="background-color:#ffffff;" cellpadding='0' cellspacing='0' border='0' width="570">
                                                        <tr>
                                                            <td height="20"></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span style="color: #333333; font-size: 14px; font-family: sans-serif;"><cq:include path="recommendText" resourceType="foundation/components/text"/></span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="10"></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <table cellpadding='0' cellspacing='0' border='0' width="570">
                                                                    <tr>
                                                                        <td width="200">
                                                                            <span style="color: #333333; font-size: 14px; font-family: sans-serif;"><cq:include path="userDescriprion" resourceType="foundation/components/text"/></span>
                                                                        </td>
                                                                        <td>
                                                                            <strong style="color: #7a7a7a; font-size: 16px; font-family: sans-serif;"><cq:include path="userID" resourceType="foundation/components/text"/></strong>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="30"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table cellpadding='0' cellspacing='0' border='0' width="570">
                                                        <tr>
                                                            <td style="border-bottom:1px solid #fecb2f;" colspan="3"></td>
                                                        </tr>
                                                        <tr>
                                                            <td height="30"></td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center">
                                                                <span style="color: #555555; font-size: 16px; font-family: sans-serif;"><cq:include path="addText" resourceType="foundation/components/text"/></span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="30"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style="border-bottom:1px solid #fecb2f;" colspan="3"></td>
                                                        </tr>
                                                        <tr>
                                                            <td height="10"></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span style="color: #333333; font-size: 12px; font-family: sans-serif;"><cq:include path="addDescription" resourceType="foundation/components/text"/></span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span style="color: #333333; font-size: 12px; font-family: sans-serif;"><a href="http://www.dhl-usa.com/save" style="color: #189aca;"><cq:include path="addLink" resourceType="foundation/components/text"/></a></span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td height="15"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="15"></td>
                                </tr>
                            </table>
                            <!-- --------------------email content end ----------------------------------------- -->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <!-- --------------------footer ----------------------------------------- -->
                            <table style="background-color:#f1f1f1;" cellpadding='0' cellspacing='0' border='0' width="600">
                                <tr>
                                    <td>
                                        <img src="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}/etc/clientlibs/dhl/global/public/img/dhl_email_footer.jpg" alt="">
                                    </td>
                                </tr>
                                <tr>
                                    <td height="5"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <table style="background-color:#f1f1f1;" cellpadding='0' cellspacing='0' border='0' width="600">
                                            <tr>
                                                <td width="15"></td>
                                                <td width="370" style="color: #7a7a7a; font-size: 10px; font-family: sans-serif;">
                                                    <cq:include path="footerLinks" resourceType="foundation/components/text"/>
                                                </td>
                                                <td width="200" align="right">
                                                    <span style="color: #7a7a7a; font-size: 10px; font-family: sans-serif;"><cq:include path="footerCopy" resourceType="foundation/components/text"/></span>
                                                </td>
                                                <td width="15"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="30"></td>
                                </tr>
                            </table>
                            <!-- -------------------- footer end ----------------------------------------- -->
                        </td>
                    </tr>
                </table>
            </td>
            <td width="50%"></td>
        </tr>
    </table>
</body>
</html>
