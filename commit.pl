#!/usr/bin/perl

use strict;

my $name = shift @ARGV || die "\nLack of commit name\n\n";

foreach my $arg ( @ARGV ) {
  $name .= " $arg";
}

my @files = qw("commit.pl"
	       "LICENSE.txt"
	       "README.md"
	       "package.json"
               "views/layouts/*.handlebars"
               "views/*.handlebars"
	       "server.js"
	       "routes/ricardo.js"
	       "lib/*.js"
               "public/*"
	       "sql/*.sql"
	     );

foreach my $file ( @files ) {
  system("git add $file");
}


system("git commit -m '$name'\n");
