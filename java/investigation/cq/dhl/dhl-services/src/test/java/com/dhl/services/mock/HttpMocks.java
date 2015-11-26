package com.dhl.services.mock;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;
import com.dhl.services.security.SecurityValidatorImpl;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.mockito.Mockito;

import javax.servlet.http.Cookie;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class HttpMocks {
    public static class Builder {
        private Page page = Mockito.mock(Page.class);
        private Resource resource = Mockito.mock(Resource.class);
        private SlingHttpServletRequest request = Mockito.mock(SlingHttpServletRequest.class);

        private Builder(String url) {
            when(page.getTags()).thenReturn(new Tag[0]);

            when(resource.getPath()).thenReturn(url);
            when(resource.isResourceType(NameConstants.NT_PAGE)).thenReturn(true);
            when(resource.adaptTo(Page.class)).thenReturn(page);

            when(request.getResource()).thenReturn(resource);
            when(request.getRequestURI()).thenReturn(url);
        }

        public Builder token(String token) {
            String cookieName = SecurityValidatorImpl.ECOM_SECURE_TOKEN;
            when(request.getCookie(cookieName)).thenReturn(new Cookie(cookieName, token));
            return this;
        }

        public Builder tags(String... tags) {
            return tags(new HashSet<>(Arrays.asList(tags)));
        }

        public Builder tags(Set<String> tags) {
            Tag[] theTags = new Tag[tags.size()];
            int i = 0;
            for (String tag : tags) {
                Tag theTag = mock(Tag.class);
                when(theTag.getName()).thenReturn(tag);
                theTags[i] = theTag;
            }
            when(page.getTags()).thenReturn(theTags);

            return this;
        }

        public SlingHttpServletRequest build() {
            return request;
        }
    }

    public static Builder mockRequest(String url) {
        return new Builder(url);
    }
}
