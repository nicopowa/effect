cls
pushd %~dp0
java -jar ../../_closure/compiler.jar ^
--js ../../_closure/goog/base.js ^
--create_source_map source_map ^
--generate_exports ^
--export_local_property_definitions ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--isolation_mode IIFE ^
--warning_level VERBOSE ^
--language_in ES6_STRICT ^
--language_out ES5_STRICT ^
--rewrite_polyfills false ^
--js js/effect.js ^
--js_output_file js/effect.min.js
popd