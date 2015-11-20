<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<ewf:registerComponent
        elements="ewf-address-book"
        paths="directives/ewf-search/ewf-search-directive,
            directives/ewf-search/ewf-show-search-on-focus-directive,
            directives/ewf-click/ewf-click-directive" />


<div ewf-search="{searchType: 'default'}" ${properties.searchAttributes} >
    <c:if test="${properties.showCategory}" >
        <span class="select select_small"
           ng-init="ewfSearchCtrl.searchCategory = 'all'">
            <select ng-model="ewfSearchCtrl.searchCategory">
                <option value="all"><fmt:message key="address_book_all_text"/></option>
                <option value="{{field.name}}"
                   ng-repeat="field in ewfSearchCtrl.fields | filter:{showInUI: 'true'}">
                    {{field.caption}}
                </option>
            </select>
        </span>
    </c:if>
    <input type="text" class="input input_small address-book ui-autocomplete-input" placeholder="Search All Contacts" id="field_searchContacts" autocomplete="off"
       ${properties.showAhead ? "typeahead=\"addr as addr.name for addr in ewfSearchCtrl.typeAheadSearch($viewValue, ewfSearchCtrl.searchCategory)\" typeahead-wait-ms=\"500\"" : "" }
       typeahead-template-url="${properties.showFavoritesFrom || properties.showFavoritesTo ? 'ewf-shipment-search-item.html' : 'ewf-search-item.html'}"
       ${properties.showFavoritesFrom ? "typeahead-on-select=\"addressDetailsCtrl.typeaheadSelected($model.data, addressDetailsCtrl.FROM, addressCtrl)\"" : ''}
       ${properties.showFavoritesTo ? "typeahead-on-select=\"addressDetailsCtrl.typeaheadSelected($model.data, addressDetailsCtrl.TO, addressCtrl)\"" : ''}
       ng-model="ewfSearchCtrl.plainSearchQuery"
    />
    <c:if test="${properties.showAddressBook}" >
        <button type="button" class="btn btn_addon btn_animate">
            <span class="btn__text"><fmt:message key="title"/></span><i class="dhlicon-address-book"></i>
        </button>
    </c:if>
    <c:if test="${properties.showSearchButton}" >
        <a class="btn btn_small"
           ewf-click="ewfSearchCtrl.plainSearch(ewfSearchCtrl.plainSearchQuery, ewfSearchCtrl.searchCategory)">
            <i class="dhlicon-search"></i>
        </a>
    </c:if>
    <script type="text/ng-template" id="ewf-search-item.html">
        <div class="ui-autocomplete-category ewf-search-item" ng-if="match.model.firstInGroup">{{ match.model.group }}</div>
        <a class="ui-autocomplete-item"
           ng-href="new-contact.html?key={{match.model.key}}">
            <span bind-html-unsafe="match.model.line1 | typeaheadHighlight:query"></span>
            <span bind-html-unsafe="match.model.line2 | typeaheadHighlight:query"></span>
            <span bind-html-unsafe="match.model.line3 | typeaheadHighlight:query"></span>
            <i bind-html-unsafe="match.model.line4"></i>
            <i bind-html-unsafe="match.model.line5 | typeaheadHighlight:query"></i>
        </a>
    </script>

    <script type="text/ng-template" id="ewf-shipment-search-item.html">
        <div class="ui-autocomplete-category"
           ewf-shipment-search-item
           ng-if="match.model.firstInGroup">
            {{match.model.group}}
        </div>
        <a class="ui-autocomplete-item">
            <span bind-html-unsafe="match.model.line1"></span>
            <span bind-html-unsafe="match.model.line2"></span>
            <span bind-html-unsafe="match.model.line3"></span>
            <i bind-html-unsafe="match.model.line4"></i>
            <i bind-html-unsafe="match.model.line5 | typeaheadHighlight:query"></i>
        </a>
    </script>
</div>