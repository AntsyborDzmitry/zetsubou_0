package com.zetsubou_0.cq.test.rest;

import com.day.cq.commons.mail.MailTemplate;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import org.apache.commons.lang.text.StrLookup;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SlingServlet(paths = "/bin/test/mailer")
public class MailServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(MailServlet.class);

    private static final String TEMPLATE = "/etc/notification/email/html/com.zetsubou_0/en.txt";

    private static final String SUBJECT = "subject";

    private static final String MESSAGE = "message";

    private static final List<InternetAddress> SEND_TO = new ArrayList<>();

    static {
        try {
            SEND_TO.add(new InternetAddress("zetsubou.zero.0@gmail.com"));
        } catch (AddressException e) {
            LOG.error("Error occurred while sending email notification.");
        }
    }

    @Reference
    private MessageGatewayService messageGatewayService;

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        String subject = "Congratulation";
        String message = "Hello. I can successfully sent email to myself";
        try {
            sendThroughMessageGateway(request.getResourceResolver(), subject, message);
        } catch (EmailException | MessagingException e) {
            LOG.error("Error occurred while sending email notification.", e);
            response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        response.getWriter().print("Success");
    }

    private void sendThroughMessageGateway(final ResourceResolver resourceResolver, final String subject,
                                           final String message)
            throws EmailException, MessagingException, IOException {
        Map<String, String> properties = new HashMap<>();
        properties.put(SUBJECT, subject);
        properties.put(MESSAGE, message);
        MailTemplate mailTemplate = MailTemplate.create(TEMPLATE, resourceResolver.adaptTo(Session.class));
        HtmlEmail email = mailTemplate.getEmail(StrLookup.mapLookup(properties), HtmlEmail.class);
        email.setTo(SEND_TO);
        email.setSSL(true);
        email.setSmtpPort(465);
        MessageGateway<HtmlEmail> messageGateway = messageGatewayService.getGateway(HtmlEmail.class);
        messageGateway.send(email);
    }
}
