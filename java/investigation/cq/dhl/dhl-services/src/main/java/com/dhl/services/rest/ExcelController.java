package com.dhl.services.rest;

import com.dhl.services.exception.DocumentException;
import com.dhl.services.service.ExcelDocumentService;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

@SlingServlet(
        resourceTypes = {"sling/servlet/default"},
        methods = {"POST"},
        selectors = {"export", "import"},
        extensions = {"xlsx"}
)
public class ExcelController extends SlingAllMethodsServlet {
    private static final Logger LOG = LoggerFactory.getLogger(ExcelController.class);

    private static final String PARAMETER_FILE = "file";
    private static final String PARAMETER_DATA = "data";
    private static final String CONTENT_DISPOSITION = "Content-Disposition";
    private static final String ATTACHMENT_FILE = "attachment; filename=";
    private static final String MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    private static final String EXPORT = "export";
    private static final String IMPORT = "import";

    @Reference
    private ExcelDocumentService excelDocumentService;

    /**
     * Handles HTTP POST request
     * @param request the HTTP request
     * @param response the HTTP response
     * @throws ServletException
     * @throws IOException If an input or output exception occurred
     */
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        RequestPathInfo requestPathInfo = request.getRequestPathInfo();
        for (String selector : requestPathInfo.getSelectors()) {
            try {
                switch (selector) {
                    case EXPORT :
                        exportAction(request, response);
                        break;
                    case IMPORT :
                        importAction(request, response);
                        break;
                    default :
                        LOG.info("Request selector to resource {} is {}", request.getResource(), selector);
                }
            } catch (DocumentException | IOException e) {
                LOG.error(e.getMessage(), e);
                if (!response.isCommitted()) {
                    response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            }
        }
    }

    /**
     * Performs an import
     * @param request the HTTP request
     * @param response the HTTP response
     * @throws IOException If an input or output exception occurred
     * @throws DocumentException If read exception occurs
     */
    private void importAction(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws IOException, DocumentException {
        RequestParameter parameter = request.getRequestParameter(PARAMETER_FILE);
        if (parameter != null) {
            try (InputStream in = parameter.getInputStream()) {
                excelDocumentService.readUpdateDocument(in);
                response.setStatus(SlingHttpServletResponse.SC_OK);
            }
        }
    }

    /**
     * Performs an export
     * @param request the HTTP request
     * @param response the HTTP response
     * @throws IOException If an input or output exception occurred
     * @throws DocumentException If export data is null
     */
    private void exportAction(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws IOException, DocumentException {
        RequestParameter parameter = request.getRequestParameter(PARAMETER_DATA);
        if (parameter == null) {
            throw new DocumentException(String.format("Required parameter \"%s\" is undefined", PARAMETER_DATA));
        }
        String data = parameter.getString();

        try (ByteArrayOutputStream byteOut = excelDocumentService.writeDocument(data)) {
            byte[] content = byteOut.toByteArray();
            String tempPath = String.format("dictionary-%s.xlsx", new Date().getTime());
            response.setContentType(MIME_TYPE);
            response.addHeader(CONTENT_DISPOSITION, ATTACHMENT_FILE + tempPath);
            response.setContentLength(content.length);
            ServletOutputStream out = response.getOutputStream();
            out.write(content);
            out.flush();
        }
    }
}
