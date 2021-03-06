################################################################################
#
# File Name: urls.py
# Application: admin_mdcs
# Purpose:
#
# Author: Sharief Youssef
#         sharief.youssef@nist.gov
#
#         Guillaume Sousa Amaral
#         guillaume.sousa@nist.gov
#
# Sponsor: National Institute of Standards and Technology (NIST)
#
################################################################################


from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include(admin.site.urls)),
    url(r'^user-management', include(admin.site.urls)),
    url(r'^user-requests$', 'admin_mdcs.views.user_requests', name='user_requests'),
    url(r'^contact-messages$', 'admin_mdcs.views.contact_messages', name='contact_messages'),
    url(r'^xml-schemas/module-management', 'admin_mdcs.views.module_management', name='module_management'),
    url(r'^xml-schemas/module-add', 'admin_mdcs.views.module_add', name='module_add'),
    url(r'^xml-schemas$', 'admin_mdcs.views.manage_schemas', name='xml-schemas'),
    url(r'^xml-schemas/manage-schemas', 'admin_mdcs.views.manage_schemas', name='xml-schemas-manage-schemas'),
    url(r'^manage-versions', 'admin_mdcs.views.manage_versions', name='manage-versions'),
    url(r'^xml-schemas/manage-types', 'admin_mdcs.views.manage_types', name='xml-schemas-manage-types'),
    url(r'^repositories$', 'admin_mdcs.views.federation_of_queries', name='federation_of_queries'),
    url(r'^repositories/add-repository', 'admin_mdcs.views.add_repository', name='add_repository'),
    url(r'^repositories/refresh-repository', 'admin_mdcs.views.refresh_repository', name='refresh_repository'),
    url(r'^website$', 'admin_mdcs.views.website', name='website'),
    url(r'^website/privacy-policy$', 'admin_mdcs.views.privacy_policy_admin', name='privacy-policy-admin_mdcs'),
    url(r'^website/terms-of-use$', 'admin_mdcs.views.terms_of_use_admin', name='terms-of-use-admin_mdcs'),
    url(r'^remove_message', 'admin_mdcs.ajax.remove_message'),
    url(r'^edit_instance', 'admin_mdcs.ajax.edit_instance'),
    url(r'^delete_instance', 'admin_mdcs.ajax.delete_instance'),
    url(r'^delete_module', 'admin_mdcs.ajax.delete_module'),
    url(r'^init_module_manager', 'admin_mdcs.ajax.init_module_manager'),
    url(r'^add_module_resource', 'admin_mdcs.ajax.add_module_resource'),
    url(r'^upload_resource', 'admin_mdcs.ajax.upload_resource'),
    url(r'^add_module', 'admin_mdcs.ajax.add_module'),
    url(r'^accept_request', 'admin_mdcs.ajax.accept_request'),
    url(r'^deny_request', 'admin_mdcs.ajax.deny_request'),
    url(r'^set_schema_version_content', 'admin_mdcs.ajax.set_schema_version_content'),
    url(r'^set_type_version_content', 'admin_mdcs.ajax.set_type_version_content'),
    url(r'^upload_version', 'admin_mdcs.ajax.upload_version'),
    url(r'^set_current_version', 'admin_mdcs.ajax.set_current_version'),
    url(r'^assign_delete_custom_message', 'admin_mdcs.ajax.assign_delete_custom_message'),
    url(r'^delete_version', 'admin_mdcs.ajax.delete_version'),
    url(r'^restore_object', 'admin_mdcs.ajax.restore_object'),
    url(r'^restore_version', 'admin_mdcs.ajax.restore_version'),
    url(r'^edit_information', 'admin_mdcs.ajax.edit_information'),
    url(r'^delete_object', 'admin_mdcs.ajax.delete_object'),
    url(r'^clear_object', 'admin_mdcs.ajax.clear_object'),
    url(r'^save_object', 'admin_mdcs.ajax.save_object'),
    url(r'^save_version', 'admin_mdcs.ajax.save_version'),
    url(r'^resolve_dependencies', 'admin_mdcs.ajax.resolve_dependencies'),
    url(r'^add_bucket', 'admin_mdcs.ajax.add_bucket'),
    url(r'^delete_bucket', 'admin_mdcs.ajax.delete_bucket'),
    url(r'^upload_object', 'admin_mdcs.ajax.upload_object'),
)
